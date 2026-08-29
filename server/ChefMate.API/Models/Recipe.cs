using ChefMate.API.Models.Enums;

namespace ChefMate.API.Models;

public class Recipe
{
    public int Id { get; set; }

    public required string ExternalId { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public required string Instructions { get; set; }

    public required string ImageUrl { get; set; }

    public required string CuisineName { get; set; }

    public required string CategoryName { get; set; }

    public MealType MealType { get; set; }

    public RecipeDiet Diet { get; set; }

    public RecipeDifficulty Difficulty { get; set; }

    public int CookTimeMinutes { get; set; }

    public int Calories { get; set; }

    public string? YoutubeUrl { get; set; }

    public required string Source { get; set; }

    public bool IsAiGenerated { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();

    public ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
}
