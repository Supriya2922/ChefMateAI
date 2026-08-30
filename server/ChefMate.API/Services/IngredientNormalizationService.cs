using System.Globalization;
using System.Text.RegularExpressions;
using ChefMate.API.Configuration;
using ChefMate.API.Data;
using ChefMate.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Services;

public partial class IngredientNormalizationService : IIngredientNormalizationService
{
    private readonly ApplicationDbContext _dbContext;

    public IngredientNormalizationService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public string NormalizeToken(string input)
    {
        var trimmed = input.Trim().ToLowerInvariant();
        trimmed = WhitespaceRegex().Replace(trimmed, " ");
        trimmed = IngredientSynonyms.Resolve(trimmed);
        trimmed = Singularize(trimmed);
        return trimmed;
    }

    public async Task<Ingredient> NormalizeAsync(string detectedName, CancellationToken cancellationToken)
    {
        var normalized = NormalizeToken(detectedName);

        var existing = await _dbContext.Ingredients
            .FirstOrDefaultAsync(i => i.NormalizedName == normalized, cancellationToken);

        if (existing is not null)
        {
            return existing;
        }

        var displayName = ToDisplayName(normalized);
        var now = DateTimeOffset.UtcNow;
        var ingredient = new Ingredient
        {
            Name = displayName,
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.Ingredients.Add(ingredient);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return ingredient;
    }

    private static string Singularize(string value)
    {
        if (value.EndsWith("ies", StringComparison.Ordinal) && value.Length > 4)
        {
            return value[..^3] + "y";
        }

        if (value.EndsWith("oes", StringComparison.Ordinal) && value.Length > 4)
        {
            return value[..^2];
        }

        if (value.EndsWith('s') && !value.EndsWith("ss", StringComparison.Ordinal) && value.Length > 3)
        {
            return value[..^1];
        }

        return value;
    }

    private static string ToDisplayName(string normalized)
    {
        return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(normalized);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();
}
