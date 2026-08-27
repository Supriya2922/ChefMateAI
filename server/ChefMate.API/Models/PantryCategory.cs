namespace ChefMate.API.Models;

public class PantryCategory
{
    public int Id { get; set; }

    public required string UserId { get; set; }

    public required string Name { get; set; }

    public string NormalizedName { get; private set; } = null!;

    public DateTimeOffset CreatedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public ICollection<PantryItem> Items { get; set; } = new List<PantryItem>();
}
