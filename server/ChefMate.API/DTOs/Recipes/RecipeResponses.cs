using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Recipes;

public class RecipeSummaryResponse
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public required string ImageUrl { get; set; }

    public required string CuisineName { get; set; }

    public required string CategoryName { get; set; }

    public required MealType MealType { get; set; }

    public required RecipeDiet Diet { get; set; }

    public required RecipeDifficulty Difficulty { get; set; }

    public int CookTimeMinutes { get; set; }

    public int Calories { get; set; }

    public int IngredientCount { get; set; }

    public IReadOnlyList<string> Tags { get; set; } = [];
}

public class RecipeIngredientResponse
{
    public required string Name { get; set; }

    public required string Quantity { get; set; }
}

public class RecipeDetailResponse
{
    public int Id { get; set; }

    public required string ExternalId { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public required string Instructions { get; set; }

    public required string ImageUrl { get; set; }

    public required string CuisineName { get; set; }

    public required string CategoryName { get; set; }

    public required MealType MealType { get; set; }

    public required RecipeDiet Diet { get; set; }

    public required RecipeDifficulty Difficulty { get; set; }

    public int CookTimeMinutes { get; set; }

    public int Calories { get; set; }

    public string? YoutubeUrl { get; set; }

    public required string Source { get; set; }

    public bool IsAiGenerated { get; set; }

    public IReadOnlyList<RecipeIngredientResponse> Ingredients { get; set; } = [];

    public IReadOnlyList<string> Tags { get; set; } = [];
}

public class RecipeListResponse
{
    public IReadOnlyList<RecipeSummaryResponse> Items { get; set; } = [];
}

public class RecipeFiltersResponse
{
    public IReadOnlyList<string> Cuisines { get; set; } = [];
}
