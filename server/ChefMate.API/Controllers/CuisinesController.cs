using ChefMate.API.DTOs.Catalog;
using ChefMate.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChefMate.API.Controllers;

[ApiController]
[Route("api/cuisines")]
[Authorize]
public class CuisinesController : ControllerBase
{
    private readonly IProfileService _profileService;

    public CuisinesController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NamedCatalogItemResponse>>> Get(
        CancellationToken cancellationToken)
    {
        var cuisines = await _profileService.GetCuisinesAsync(cancellationToken);
        return Ok(cuisines);
    }
}
