using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Pantry;

public class PantryCategoryResponse
{
    public int Id { get; set; }

    public required string Name { get; set; }
}

public class PantryItemResponse
{
    public int Id { get; set; }

    public int? IngredientId { get; set; }

    public required string Name { get; set; }

    public decimal Quantity { get; set; }

    public required PantryUnit Unit { get; set; }

    public required PantryCategoryResponse Category { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public required ExpiryStatus ExpiryStatus { get; set; }

    public int? DaysUntilExpiry { get; set; }

    public required PantryItemSource Source { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}

public class PantrySummaryResponse
{
    public int TotalCount { get; set; }

    public int ExpiringSoonCount { get; set; }

    public int ExpiredCount { get; set; }
}

public class PantryListResponse
{
    public IReadOnlyList<PantryItemResponse> Items { get; set; } = [];

    public required PantrySummaryResponse Summary { get; set; }
}
