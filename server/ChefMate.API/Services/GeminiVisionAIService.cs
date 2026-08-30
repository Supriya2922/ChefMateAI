using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ChefMate.API.Configuration;
using Microsoft.Extensions.Options;

namespace ChefMate.API.Services;

public class GeminiVisionAIService : IVisionAIService
{
    private const int MaxImageBytes = 10 * 1024 * 1024;

    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    };

    private static readonly string DetectionPrompt = """
        You are a pantry vision assistant. Analyze the image and identify visible food ingredients only.
        Rules:
        - Ignore non-food objects, packaging labels you cannot read, and hidden items.
        - Do not guess ingredients that are not clearly visible.
        - Do not invent quantities. If you cannot reliably determine amount, set quantity to null.
        - Return JSON only with this exact shape:
        {"ingredients":[{"name":"Tomato","quantity":4,"unit":"piece","confidence":0.96}]}
        - unit should be lowercase singular words like piece, gram, kilogram, liter, milliliter, bunch, pack, cup.
        - confidence is between 0 and 1 when you can estimate it, otherwise null.
        - If no food ingredients are visible, return {"ingredients":[]}.
        """;

    private readonly HttpClient _httpClient;
    private readonly GeminiOptions _options;
    private readonly ILogger<GeminiVisionAIService> _logger;

    public GeminiVisionAIService(
        HttpClient httpClient,
        IOptions<GeminiOptions> options,
        ILogger<GeminiVisionAIService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<VisionDetectionResult> DetectIngredientsAsync(
        Stream imageStream,
        string contentType,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException("Gemini API key is not configured.");
        }

        if (!AllowedMimeTypes.Contains(contentType))
        {
            throw new InvalidOperationException("Unsupported image type.");
        }

        await using var buffer = new MemoryStream();
        await imageStream.CopyToAsync(buffer, cancellationToken);
        if (buffer.Length == 0)
        {
            throw new InvalidOperationException("Image file is empty.");
        }

        if (buffer.Length > MaxImageBytes)
        {
            throw new InvalidOperationException("Image file is too large.");
        }

        var base64 = Convert.ToBase64String(buffer.ToArray());
        var mime = contentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase)
            ? "image/jpeg"
            : contentType;

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = DetectionPrompt },
                        new
                        {
                            inline_data = new
                            {
                                mime_type = mime,
                                data = base64
                            }
                        }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.2,
                responseMimeType = "application/json"
            }
        };

        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/{Uri.EscapeDataString(_options.Model)}:generateContent?key={Uri.EscapeDataString(_options.ApiKey)}";

        using var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json")
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning(
                "Gemini vision request failed with status {StatusCode}: {Body}",
                (int)response.StatusCode,
                responseText);

            var userMessage = TryReadGeminiErrorMessage(responseText)
                ?? (response.StatusCode == System.Net.HttpStatusCode.Unauthorized
                    ? "Gemini API key is invalid or missing."
                    : "Vision service is temporarily unavailable.");

            throw new InvalidOperationException(userMessage);
        }

        return ParseGeminiResponse(responseText);
    }

    private static VisionDetectionResult ParseGeminiResponse(string responseText)
    {
        using var document = JsonDocument.Parse(responseText);
        var root = document.RootElement;

        if (!root.TryGetProperty("candidates", out var candidates) ||
            candidates.GetArrayLength() == 0)
        {
            return new VisionDetectionResult();
        }

        var content = candidates[0].GetProperty("content");
        var parts = content.GetProperty("parts");
        var text = parts[0].GetProperty("text").GetString();
        if (string.IsNullOrWhiteSpace(text))
        {
            return new VisionDetectionResult();
        }

        var payload = JsonSerializer.Deserialize<GeminiIngredientPayload>(
            text,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var ingredients = payload?.Ingredients?
            .Where(item => !string.IsNullOrWhiteSpace(item.Name))
            .Select(item => new DetectedIngredient
            {
                Name = item.Name.Trim(),
                Quantity = item.Quantity,
                Unit = string.IsNullOrWhiteSpace(item.Unit) ? null : item.Unit.Trim().ToLowerInvariant(),
                Confidence = item.Confidence is >= 0 and <= 1 ? item.Confidence : null
            })
            .ToList() ?? [];

        return new VisionDetectionResult { Ingredients = ingredients };
    }

    private static string? TryReadGeminiErrorMessage(string responseText)
    {
        try
        {
            using var document = JsonDocument.Parse(responseText);
            if (document.RootElement.TryGetProperty("error", out var error) &&
                error.TryGetProperty("message", out var message))
            {
                var text = message.GetString();
                if (!string.IsNullOrWhiteSpace(text) &&
                    text.Contains("no longer available", StringComparison.OrdinalIgnoreCase))
                {
                    return "The configured Gemini model is unavailable. Update Gemini__Model in .env.";
                }
            }
        }
        catch (JsonException)
        {
        }

        return null;
    }

    private sealed class GeminiIngredientPayload
    {
        [JsonPropertyName("ingredients")]
        public List<GeminiIngredientItem>? Ingredients { get; set; }
    }

    private sealed class GeminiIngredientItem
    {
        public string Name { get; set; } = string.Empty;

        public decimal? Quantity { get; set; }

        public string? Unit { get; set; }

        public decimal? Confidence { get; set; }
    }
}
