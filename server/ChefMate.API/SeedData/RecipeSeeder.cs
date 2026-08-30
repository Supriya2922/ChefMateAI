using System.Text.Json;
using ChefMate.API.Data;
using ChefMate.API.Models;
using ChefMate.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.SeedData;

public static class RecipeSeeder
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task SeedAsync(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        var seedFilePath = Path.Combine(environment.ContentRootPath, "SeedData", "recipes.json");

        if (!File.Exists(seedFilePath))
        {
            logger.LogWarning("Recipe seed file not found at {SeedFilePath}.", seedFilePath);
            return;
        }

        var needsReseed = !await context.Recipes.AnyAsync(cancellationToken)
            || await context.Recipes.AnyAsync(r => r.CookTimeMinutes <= 0, cancellationToken);

        if (!needsReseed)
        {
            logger.LogInformation("Recipe seed skipped because recipes already exist.");
            return;
        }

        if (await context.Recipes.AnyAsync(cancellationToken))
        {
            logger.LogInformation("Clearing existing recipes so cook time and calories can be reseeded.");
            await context.RecipeTags.ExecuteDeleteAsync(cancellationToken);
            await context.RecipeIngredients.ExecuteDeleteAsync(cancellationToken);
            await context.Recipes.ExecuteDeleteAsync(cancellationToken);
            await context.Tags.ExecuteDeleteAsync(cancellationToken);
            await context.Ingredients.ExecuteDeleteAsync(cancellationToken);
        }

        await using var stream = File.OpenRead(seedFilePath);

        var seedRecords = await JsonSerializer.DeserializeAsync<List<RecipeSeedRecord>>(
            stream,
            JsonOptions,
            cancellationToken);

        if (seedRecords is null || seedRecords.Count == 0)
        {
            logger.LogWarning("Recipe seed file at {SeedFilePath} is empty.", seedFilePath);
            return;
        }

        // Phase 1: persist shared Ingredient/Tag rows so join entities get real FKs
        // (avoids EF tracking conflicts when many RecipeIngredients share temporary Id=0).
        var ingredientLookup = new Dictionary<string, Ingredient>(StringComparer.OrdinalIgnoreCase);
        var tagLookup = new Dictionary<string, Tag>(StringComparer.OrdinalIgnoreCase);

        foreach (var record in seedRecords)
        {
            foreach (var seedIngredient in record.Ingredients)
            {
                var ingredientName = seedIngredient.Name.Trim();
                if (string.IsNullOrWhiteSpace(ingredientName) || ingredientLookup.ContainsKey(ingredientName))
                {
                    continue;
                }

                var now = DateTimeOffset.UtcNow;
                var ingredient = new Ingredient
                {
                    Name = ingredientName,
                    CreatedAt = now,
                    UpdatedAt = now
                };
                context.Ingredients.Add(ingredient);
                ingredientLookup[ingredientName] = ingredient;
            }

            foreach (var seedTag in record.Tags)
            {
                var tagName = seedTag.Trim();
                if (string.IsNullOrWhiteSpace(tagName) || tagLookup.ContainsKey(tagName))
                {
                    continue;
                }

                var tag = new Tag { Name = tagName };
                context.Tags.Add(tag);
                tagLookup[tagName] = tag;
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        // Phase 2: insert recipes with resolved IngredientId / TagId values.
        var seededAt = DateTimeOffset.UtcNow;

        foreach (var record in seedRecords)
        {
            var recipe = new Recipe
            {
                ExternalId = record.ExternalId,
                Title = record.Title,
                Description = record.Description,
                Instructions = record.Instructions,
                ImageUrl = record.ImageUrl,
                CuisineName = record.Cuisine,
                CategoryName = record.Category,
                MealType = ParseMealType(record.MealType),
                Diet = ParseDiet(record.Diet),
                Difficulty = ParseDifficulty(record.Difficulty),
                CookTimeMinutes = record.CookTimeMinutes > 0
                    ? record.CookTimeMinutes
                    : FallbackCookTime(ParseDifficulty(record.Difficulty)),
                Calories = record.Calories > 0
                    ? record.Calories
                    : FallbackCalories(ParseMealType(record.MealType), record.Category),
                YoutubeUrl = string.IsNullOrWhiteSpace(record.YoutubeUrl) ? null : record.YoutubeUrl,
                Source = record.Source,
                IsAiGenerated = record.IsAiGenerated,
                CreatedAt = seededAt
            };

            var seenIngredients = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var seedIngredient in record.Ingredients)
            {
                var ingredientName = seedIngredient.Name.Trim();

                if (string.IsNullOrWhiteSpace(ingredientName) || !seenIngredients.Add(ingredientName))
                {
                    continue;
                }

                var ingredient = ingredientLookup[ingredientName];

                recipe.RecipeIngredients.Add(new RecipeIngredient
                {
                    IngredientId = ingredient.Id,
                    Quantity = seedIngredient.Quantity?.Trim() ?? string.Empty
                });
            }

            var seenTags = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var seedTag in record.Tags)
            {
                var tagName = seedTag.Trim();

                if (string.IsNullOrWhiteSpace(tagName) || !seenTags.Add(tagName))
                {
                    continue;
                }

                var tag = tagLookup[tagName];

                recipe.RecipeTags.Add(new RecipeTag
                {
                    TagId = tag.Id
                });
            }

            context.Recipes.Add(recipe);
        }

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded {RecipeCount} recipes from {SeedFilePath}.", seedRecords.Count, seedFilePath);
    }

    private static MealType ParseMealType(string value) =>
        Enum.TryParse<MealType>(value, ignoreCase: true, out var mealType)
            ? mealType
            : MealType.Dinner;

    private static RecipeDiet ParseDiet(string value) =>
        value.Equals("Non-Vegetarian", StringComparison.OrdinalIgnoreCase)
            ? RecipeDiet.NonVegetarian
            : Enum.TryParse<RecipeDiet>(value, ignoreCase: true, out var diet)
                ? diet
                : RecipeDiet.Vegetarian;

    private static RecipeDifficulty ParseDifficulty(string value) =>
        Enum.TryParse<RecipeDifficulty>(value, ignoreCase: true, out var difficulty)
            ? difficulty
            : RecipeDifficulty.Medium;

    private static int FallbackCookTime(RecipeDifficulty difficulty) =>
        difficulty switch
        {
            RecipeDifficulty.Easy => 25,
            RecipeDifficulty.Hard => 60,
            _ => 45
        };

    private static int FallbackCalories(MealType mealType, string category)
    {
        var categoryLower = category.ToLowerInvariant();

        if (mealType == MealType.Dessert || categoryLower == "dessert")
        {
            return 350;
        }

        if (mealType == MealType.Breakfast || categoryLower == "breakfast")
        {
            return 400;
        }

        if (categoryLower is "seafood" or "vegetarian")
        {
            return 450;
        }

        return 550;
    }
}
