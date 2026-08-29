namespace ChefMate.API.Models;

public class RecipeIngredient
{
    public int RecipeId { get; set; }

    public int IngredientId { get; set; }

    public required string Quantity { get; set; }

    public Recipe Recipe { get; set; } = null!;

    public Ingredient Ingredient { get; set; } = null!;
}
