using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Pantry;

public class PantryScanDetectedItemResponse
{
    public int Id { get; set; }

    public int? IngredientId { get; set; }

    public required string Name { get; set; }

    public decimal? Quantity { get; set; }

    public string? Unit { get; set; }

    public decimal? Confidence { get; set; }

    public bool NeedsQuantityConfirmation { get; set; }
}

public class PantryScanResponse
{
    public int ScanId { get; set; }

    public required PantryScanStatus Status { get; set; }

    public IReadOnlyList<PantryScanDetectedItemResponse> Items { get; set; } = [];
}

public class ConfirmPantryScanItemRequest
{
    public int IngredientId { get; set; }

    public decimal Quantity { get; set; }

    public PantryUnit Unit { get; set; }
}

public class ConfirmPantryScanRequest
{
    public IReadOnlyList<ConfirmPantryScanItemRequest> Items { get; set; } = [];
}

public class ConfirmPantryScanResponse
{
    public int AddedOrUpdatedCount { get; set; }

    public IReadOnlyList<PantryItemResponse> Items { get; set; } = [];
}
