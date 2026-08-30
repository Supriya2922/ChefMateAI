using ChefMate.API.Data;
using ChefMate.API.DTOs.Pantry;
using ChefMate.API.Models;
using ChefMate.API.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ChefMate.API.Services;

public class PantryScanService : IPantryScanService
{
    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    };

    private const int MaxImageBytes = 10 * 1024 * 1024;

    private readonly ApplicationDbContext _dbContext;
    private readonly IVisionAIService _visionService;
    private readonly IIngredientNormalizationService _normalizationService;
    private readonly IPantryService _pantryService;
    private readonly ILogger<PantryScanService> _logger;

    public PantryScanService(
        ApplicationDbContext dbContext,
        IVisionAIService visionService,
        IIngredientNormalizationService normalizationService,
        IPantryService pantryService,
        ILogger<PantryScanService> logger)
    {
        _dbContext = dbContext;
        _visionService = visionService;
        _normalizationService = normalizationService;
        _pantryService = pantryService;
        _logger = logger;
    }

    public async Task<PantryScanOperationResult> ScanAsync(
        string userId,
        Stream imageStream,
        string contentType,
        CancellationToken cancellationToken)
    {
        if (!AllowedMimeTypes.Contains(contentType))
        {
            return PantryScanOperationResult.Failure("Unsupported image type. Use JPG, PNG, or WEBP.");
        }

        if (!ImageFileValidator.IsAllowedContentType(contentType))
        {
            return PantryScanOperationResult.Failure("Unsupported image type. Use JPG, PNG, or WEBP.");
        }

        await using var buffer = new MemoryStream();
        await imageStream.CopyToAsync(buffer, cancellationToken);
        if (buffer.Length == 0)
        {
            return PantryScanOperationResult.Failure("Please upload an image file.");
        }

        if (buffer.Length > MaxImageBytes)
        {
            return PantryScanOperationResult.Failure("Image is too large. Maximum size is 10 MB.");
        }

        if (!ImageFileValidator.HasValidSignature(buffer.ToArray(), contentType))
        {
            return PantryScanOperationResult.Failure("The uploaded file is not a valid image.");
        }

        var now = DateTimeOffset.UtcNow;
        var scan = new PantryScan
        {
            UserId = userId,
            ImageUrl = null,
            Status = PantryScanStatus.Processing,
            CreatedAt = now
        };

        _dbContext.PantryScans.Add(scan);
        await _dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            buffer.Position = 0;
            var detection = await _visionService.DetectIngredientsAsync(buffer, contentType, cancellationToken);

            if (detection.Ingredients.Count == 0)
            {
                scan.Status = PantryScanStatus.Completed;
                scan.CompletedAt = DateTimeOffset.UtcNow;
                await _dbContext.SaveChangesAsync(cancellationToken);

                return PantryScanOperationResult.Success(new PantryScanResponse
                {
                    ScanId = scan.Id,
                    Status = scan.Status,
                    Items = []
                });
            }

            var responses = new List<PantryScanDetectedItemResponse>();

            foreach (var detected in detection.Ingredients)
            {
                var ingredient = await _normalizationService.NormalizeAsync(detected.Name, cancellationToken);
                var scanItem = new PantryScanItem
                {
                    PantryScanId = scan.Id,
                    IngredientId = ingredient.Id,
                    DetectedName = detected.Name.Trim(),
                    DetectedQuantity = detected.Quantity,
                    DetectedUnit = detected.Unit,
                    Confidence = detected.Confidence,
                    Confirmed = false,
                    CreatedAt = DateTimeOffset.UtcNow
                };

                _dbContext.PantryScanItems.Add(scanItem);
                responses.Add(MapScanItem(scanItem, ingredient.Name));
            }

            scan.Status = PantryScanStatus.Completed;
            scan.CompletedAt = DateTimeOffset.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);

            return PantryScanOperationResult.Success(new PantryScanResponse
            {
                ScanId = scan.Id,
                Status = scan.Status,
                Items = responses
            });
        }
        catch (Exception ex) when (ex is InvalidOperationException or JsonException)
        {
            scan.Status = PantryScanStatus.Failed;
            scan.CompletedAt = DateTimeOffset.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogWarning(ex, "Pantry scan {ScanId} failed for user {UserId}", scan.Id, userId);

            var message = ex.Message.Contains("no ingredients", StringComparison.OrdinalIgnoreCase)
                ? "No ingredients could be confidently identified. Try taking a clearer photo."
                : ex.Message;

            return PantryScanOperationResult.Failure(message);
        }
        catch (Exception ex)
        {
            scan.Status = PantryScanStatus.Failed;
            scan.CompletedAt = DateTimeOffset.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogError(ex, "Pantry scan {ScanId} failed unexpectedly for user {UserId}", scan.Id, userId);
            return PantryScanOperationResult.Failure(
                "Something went wrong while scanning your pantry. Please try again.");
        }
    }

    public async Task<PantryScanOperationResult> ConfirmAsync(
        string userId,
        int scanId,
        ConfirmPantryScanRequest request,
        CancellationToken cancellationToken)
    {
        var scan = await _dbContext.PantryScans
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == scanId, cancellationToken);

        if (scan is null)
        {
            return PantryScanOperationResult.Missing();
        }

        if (scan.UserId != userId)
        {
            return PantryScanOperationResult.Denied();
        }

        if (scan.Status != PantryScanStatus.Completed)
        {
            return PantryScanOperationResult.Failure("This scan is not ready to confirm.");
        }

        var ingredientIds = request.Items.Select(i => i.IngredientId).Distinct().ToList();
        var ingredients = await _dbContext.Ingredients
            .Where(i => ingredientIds.Contains(i.Id))
            .ToDictionaryAsync(i => i.Id, cancellationToken);

        if (ingredients.Count != ingredientIds.Count)
        {
            return PantryScanOperationResult.Failure("One or more ingredients are invalid.");
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var updatedItems = new List<PantryItemResponse>();

            foreach (var confirmed in request.Items)
            {
                var ingredient = ingredients[confirmed.IngredientId];
                var pantryItem = await _pantryService.UpsertFromScanAsync(
                    userId,
                    ingredient,
                    confirmed.Quantity,
                    confirmed.Unit,
                    cancellationToken);

                updatedItems.Add(pantryItem);

                var scanItem = scan.Items.FirstOrDefault(i => i.IngredientId == confirmed.IngredientId);
                if (scanItem is not null)
                {
                    scanItem.Confirmed = true;
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return PantryScanOperationResult.ConfirmSuccess(new ConfirmPantryScanResponse
            {
                AddedOrUpdatedCount = updatedItems.Count,
                Items = updatedItems
            });
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    private static PantryScanDetectedItemResponse MapScanItem(PantryScanItem item, string ingredientName)
    {
        return new PantryScanDetectedItemResponse
        {
            Id = item.Id,
            IngredientId = item.IngredientId,
            Name = ingredientName,
            Quantity = item.DetectedQuantity,
            Unit = MapDetectedUnit(item.DetectedUnit),
            Confidence = item.Confidence,
            NeedsQuantityConfirmation = item.DetectedQuantity is null
        };
    }

    private static string? MapDetectedUnit(string? unit)
    {
        if (string.IsNullOrWhiteSpace(unit))
        {
            return null;
        }

        return unit.Trim().ToLowerInvariant() switch
        {
            "piece" or "pieces" => "Piece",
            "gram" or "grams" or "g" => "Gram",
            "kilogram" or "kilograms" or "kg" => "Kilogram",
            "milliliter" or "milliliters" or "ml" => "Milliliter",
            "liter" or "liters" or "l" => "Liter",
            "bunch" or "bunches" => "Bunch",
            "pack" or "packs" => "Pack",
            "cup" or "cups" => "Cup",
            "tablespoon" or "tablespoons" or "tbsp" => "Tablespoon",
            "teaspoon" or "teaspoons" or "tsp" => "Teaspoon",
            _ => unit
        };
    }
}
