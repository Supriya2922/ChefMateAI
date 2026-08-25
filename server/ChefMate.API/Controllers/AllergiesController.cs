using ChefMate.API.DTOs.Catalog;
using ChefMate.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChefMate.API.Controllers;

[ApiController]
[Route("api/allergies")]
[Authorize]
public class AllergiesController : ControllerBase
{
    private readonly IProfileService _profileService;

    public AllergiesController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NamedCatalogItemResponse>>> Get(
        CancellationToken cancellationToken)
    {
        var allergies = await _profileService.GetAllergiesAsync(cancellationToken);
        return Ok(allergies);
    }
}
