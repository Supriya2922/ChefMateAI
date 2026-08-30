namespace ChefMate.API.Models;

public class PantryScanItem
{
    public int Id { get; set; }

    public int PantryScanId { get; set; }

    public int? IngredientId { get; set; }

    public required string DetectedName { get; set; }

    public decimal? DetectedQuantity { get; set; }

    public string? DetectedUnit { get; set; }

    public decimal? Confidence { get; set; }

    public bool Confirmed { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public PantryScan PantryScan { get; set; } = null!;

    public Ingredient? Ingredient { get; set; }
}
