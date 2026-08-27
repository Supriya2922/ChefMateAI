using ChefMate.API.DTOs.Pantry;

namespace ChefMate.API.Services;

public interface IPantryService
{
    Task<PantryListResponse> ListItemsAsync(
        string userId,
        PantryListQuery query,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<PantryCategoryResponse>> GetCategoriesAsync(
        string userId,
        CancellationToken cancellationToken);

    Task<PantryItemResponse?> GetItemAsync(
        string userId,
        int id,
        CancellationToken cancellationToken);

    Task<PantryMutationResult> CreateItemAsync(
        string userId,
        CreatePantryItemRequest request,
        CancellationToken cancellationToken);

    Task<PantryMutationResult> UpdateItemAsync(
        string userId,
        int id,
        UpdatePantryItemRequest request,
        CancellationToken cancellationToken);

    Task<PantryMutationResult> UpdateQuantityAsync(
        string userId,
        int id,
        UpdatePantryQuantityRequest request,
        CancellationToken cancellationToken);

    Task<bool> DeleteItemAsync(string userId, int id, CancellationToken cancellationToken);
}
