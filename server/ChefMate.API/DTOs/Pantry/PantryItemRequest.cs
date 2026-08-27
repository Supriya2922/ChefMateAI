using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Pantry;

public class PantryItemRequest
{
    public string Name { get; set; } = string.Empty;

    public decimal Quantity { get; set; }

    public PantryUnit Unit { get; set; }

    public string CategoryName { get; set; } = string.Empty;

    public DateOnly? ExpiryDate { get; set; }
}

public class CreatePantryItemRequest : PantryItemRequest;

public class UpdatePantryItemRequest : PantryItemRequest;
