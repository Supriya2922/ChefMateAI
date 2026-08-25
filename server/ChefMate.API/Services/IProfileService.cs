using ChefMate.API.DTOs.Catalog;
using ChefMate.API.DTOs.Profile;

namespace ChefMate.API.Services;

public interface IProfileService
{
    Task<ProfileResponse?> GetProfileAsync(string userId, CancellationToken cancellationToken);

    Task<ProfileResponse?> UpdateProfileAsync(
        string userId,
        UpdateProfileRequest request,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<NamedCatalogItemResponse>> GetAllergiesAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<NamedCatalogItemResponse>> GetCuisinesAsync(CancellationToken cancellationToken);
}
