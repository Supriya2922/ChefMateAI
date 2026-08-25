using System.Security.Claims;
using ChefMate.API.DTOs.Profile;
using ChefMate.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChefMate.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<ProfileResponse>> Get(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var profile = await _profileService.GetProfileAsync(userId, cancellationToken);
        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    [HttpPut]
    public async Task<ActionResult<ProfileResponse>> Update(
        [FromBody] UpdateProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var profile = await _profileService.UpdateProfileAsync(userId, request, cancellationToken);
        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    private string? GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier);
}
