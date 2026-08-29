namespace ChefMate.API.Models;

public class Tag
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public string NormalizedName { get; private set; } = null!;

    public ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
}
