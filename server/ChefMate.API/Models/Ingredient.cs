namespace ChefMate.API.Models;

public class Ingredient
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public string NormalizedName { get; private set; } = null!;

    public string? Category { get; set; }

    public string? ImageUrl { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();

    public ICollection<PantryItem> PantryItems { get; set; } = new List<PantryItem>();

    public ICollection<PantryScanItem> PantryScanItems { get; set; } = new List<PantryScanItem>();
}
