namespace ChefMate.API.Models;

public class Ingredient
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public string NormalizedName { get; private set; } = null!;

    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
}
