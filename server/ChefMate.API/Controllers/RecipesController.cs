using ChefMate.API.DTOs.Recipes;
using ChefMate.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChefMate.API.Controllers;

[ApiController]
[Route("api/recipes")]
[Authorize]
public class RecipesController : ControllerBase
{
    private readonly IRecipeService _recipeService;

    public RecipesController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    [HttpGet]
    public async Task<ActionResult<RecipeListResponse>> List(
        [FromQuery] RecipeListQuery query,
        CancellationToken cancellationToken)
    {
        var recipes = await _recipeService.ListAsync(query, cancellationToken);
        return Ok(recipes);
    }

    [HttpGet("filters")]
    public async Task<ActionResult<RecipeFiltersResponse>> Filters(CancellationToken cancellationToken)
    {
        var filters = await _recipeService.GetFiltersAsync(cancellationToken);
        return Ok(filters);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RecipeDetailResponse>> Get(
        int id,
        CancellationToken cancellationToken)
    {
        var recipe = await _recipeService.GetByIdAsync(id, cancellationToken);
        if (recipe is null)
        {
            return NotFound(new { errors = new[] { "Recipe not found." } });
        }

        return Ok(recipe);
    }
}
