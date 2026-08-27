using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Pantry;

public class PantryListQuery
{
    public string? Search { get; set; }

    public int? CategoryId { get; set; }

    public ExpiryStatus? ExpiryStatus { get; set; }

    public string? Sort { get; set; }
}
