using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Recipes;

public class RecipeListQuery
{
    public string? Search { get; set; }

    public string? Cuisine { get; set; }

    public RecipeDiet? Diet { get; set; }

    public RecipeDifficulty? Difficulty { get; set; }
}
