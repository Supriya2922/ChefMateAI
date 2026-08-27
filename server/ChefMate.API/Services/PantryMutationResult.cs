using ChefMate.API.DTOs.Pantry;

namespace ChefMate.API.Services;

public class PantryMutationResult
{
    public bool NotFound { get; init; }

    public bool Conflict { get; init; }

    public string? Error { get; init; }

    public PantryItemResponse? Item { get; init; }

    public static PantryMutationResult Success(PantryItemResponse item) =>
        new() { Item = item };

    public static PantryMutationResult Missing() =>
        new() { NotFound = true };

    public static PantryMutationResult Duplicate(string name) =>
        new()
        {
            Conflict = true,
            Error = $"{name} is already in your pantry. Update quantity instead?"
        };
}
