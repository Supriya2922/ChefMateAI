using ChefMate.API.Data;
using ChefMate.API.DTOs.Recipes;
using ChefMate.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Services;

public class RecipeService : IRecipeService
{
    private readonly ApplicationDbContext _dbContext;

    public RecipeService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RecipeListResponse> ListAsync(
        RecipeListQuery query,
        CancellationToken cancellationToken)
    {
        var recipesQuery = _dbContext.Recipes
            .AsNoTracking()
            .Include(r => r.RecipeIngredients)
            .Include(r => r.RecipeTags)
            .ThenInclude(rt => rt.Tag)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = $"%{EscapeLike(query.Search.Trim())}%";
            recipesQuery = recipesQuery.Where(r =>
                EF.Functions.ILike(r.Title, term, "\\")
                || EF.Functions.ILike(r.Description, term, "\\"));
        }

        if (!string.IsNullOrWhiteSpace(query.Cuisine))
        {
            var cuisine = query.Cuisine.Trim();
            recipesQuery = recipesQuery.Where(r => r.CuisineName == cuisine);
        }

        if (query.Diet is { } diet)
        {
            recipesQuery = recipesQuery.Where(r => r.Diet == diet);
        }

        if (query.Difficulty is { } difficulty)
        {
            recipesQuery = recipesQuery.Where(r => r.Difficulty == difficulty);
        }

        var items = await recipesQuery
            .OrderBy(r => r.Title)
            .ToListAsync(cancellationToken);

        return new RecipeListResponse
        {
            Items = items.Select(MapSummary).ToList()
        };
    }

    public async Task<RecipeDetailResponse?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var recipe = await _dbContext.Recipes
            .AsNoTracking()
            .Include(r => r.RecipeIngredients)
            .ThenInclude(ri => ri.Ingredient)
            .Include(r => r.RecipeTags)
            .ThenInclude(rt => rt.Tag)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        return recipe is null ? null : MapDetail(recipe);
    }

    public async Task<RecipeFiltersResponse> GetFiltersAsync(CancellationToken cancellationToken)
    {
        var cuisines = await _dbContext.Recipes
            .AsNoTracking()
            .Select(r => r.CuisineName)
            .Distinct()
            .OrderBy(name => name)
            .ToListAsync(cancellationToken);

        return new RecipeFiltersResponse
        {
            Cuisines = cuisines
        };
    }

    private static RecipeSummaryResponse MapSummary(Recipe recipe) =>
        new()
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Description = recipe.Description,
            ImageUrl = recipe.ImageUrl,
            CuisineName = recipe.CuisineName,
            CategoryName = recipe.CategoryName,
            MealType = recipe.MealType,
            Diet = recipe.Diet,
            Difficulty = recipe.Difficulty,
            CookTimeMinutes = recipe.CookTimeMinutes,
            Calories = recipe.Calories,
            IngredientCount = recipe.RecipeIngredients.Count,
            Tags = recipe.RecipeTags
                .Select(rt => rt.Tag.Name)
                .OrderBy(name => name)
                .ToList()
        };

    private static RecipeDetailResponse MapDetail(Recipe recipe) =>
        new()
        {
            Id = recipe.Id,
            ExternalId = recipe.ExternalId,
            Title = recipe.Title,
            Description = recipe.Description,
            Instructions = recipe.Instructions,
            ImageUrl = recipe.ImageUrl,
            CuisineName = recipe.CuisineName,
            CategoryName = recipe.CategoryName,
            MealType = recipe.MealType,
            Diet = recipe.Diet,
            Difficulty = recipe.Difficulty,
            CookTimeMinutes = recipe.CookTimeMinutes,
            Calories = recipe.Calories,
            YoutubeUrl = recipe.YoutubeUrl,
            Source = recipe.Source,
            IsAiGenerated = recipe.IsAiGenerated,
            Ingredients = recipe.RecipeIngredients
                .OrderBy(ri => ri.Ingredient.Name)
                .Select(ri => new RecipeIngredientResponse
                {
                    Name = ri.Ingredient.Name,
                    Quantity = ri.Quantity
                })
                .ToList(),
            Tags = recipe.RecipeTags
                .Select(rt => rt.Tag.Name)
                .OrderBy(name => name)
                .ToList()
        };

    private static string EscapeLike(string value) =>
        value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("%", "\\%", StringComparison.Ordinal)
            .Replace("_", "\\_", StringComparison.Ordinal);
}
