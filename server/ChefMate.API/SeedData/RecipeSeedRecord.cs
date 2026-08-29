namespace ChefMate.API.SeedData;

public sealed class RecipeSeedRecord
{
    public required string ExternalId { get; init; }

    public required string Title { get; init; }

    public required string Description { get; init; }

    public required string ImageUrl { get; init; }

    public required string Instructions { get; init; }

    public required string Cuisine { get; init; }

    public required string Category { get; init; }

    public required string MealType { get; init; }

    public required string Diet { get; init; }

    public required string Difficulty { get; init; }

    public int CookTimeMinutes { get; init; }

    public int Calories { get; init; }

    public required IReadOnlyList<RecipeSeedIngredient> Ingredients { get; init; }

    public required IReadOnlyList<string> Tags { get; init; }

    public string? YoutubeUrl { get; init; }

    public required string Source { get; init; }

    public bool IsAiGenerated { get; init; }
}

public sealed class RecipeSeedIngredient
{
    public required string Name { get; init; }

    public required string Quantity { get; init; }
}
