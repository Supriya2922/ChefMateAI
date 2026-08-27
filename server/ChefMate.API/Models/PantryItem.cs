using ChefMate.API.Models.Enums;

namespace ChefMate.API.Models;

public class PantryItem
{
    public int Id { get; set; }

    public required string UserId { get; set; }

    public required string Name { get; set; }

    public string NormalizedName { get; private set; } = null!;

    public decimal Quantity { get; set; }

    public PantryUnit Unit { get; set; }

    public int CategoryId { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public PantryCategory Category { get; set; } = null!;
}
