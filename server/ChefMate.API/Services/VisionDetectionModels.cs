namespace ChefMate.API.Services;

public class DetectedIngredient
{
    public required string Name { get; init; }

    public decimal? Quantity { get; init; }

    public string? Unit { get; init; }

    public decimal? Confidence { get; init; }
}

public class VisionDetectionResult
{
    public IReadOnlyList<DetectedIngredient> Ingredients { get; init; } = [];
}
