using ChefMate.API.Models;

namespace ChefMate.API.Services;

public interface IIngredientNormalizationService
{
    Task<Ingredient> NormalizeAsync(string detectedName, CancellationToken cancellationToken);

    string NormalizeToken(string input);
}
