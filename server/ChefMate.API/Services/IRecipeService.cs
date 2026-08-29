using ChefMate.API.DTOs.Recipes;

namespace ChefMate.API.Services;

public interface IRecipeService
{
    Task<RecipeListResponse> ListAsync(RecipeListQuery query, CancellationToken cancellationToken);

    Task<RecipeDetailResponse?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<RecipeFiltersResponse> GetFiltersAsync(CancellationToken cancellationToken);
}
