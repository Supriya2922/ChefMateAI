using System.Security.Claims;
using ChefMate.API.DTOs.Pantry;
using ChefMate.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChefMate.API.Controllers;

[ApiController]
[Route("api/pantry")]
[Authorize]
public class PantryController : ControllerBase
{
    private readonly IPantryService _pantryService;
    private readonly IPantryScanService _pantryScanService;

    public PantryController(IPantryService pantryService, IPantryScanService pantryScanService)
    {
        _pantryService = pantryService;
        _pantryScanService = pantryScanService;
    }

    [HttpGet]
    public async Task<ActionResult<PantryListResponse>> List(
        [FromQuery] PantryListQuery query,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var pantry = await _pantryService.ListItemsAsync(userId, query, cancellationToken);
        return Ok(pantry);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<PantryCategoryResponse>>> Categories(
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var categories = await _pantryService.GetCategoriesAsync(userId, cancellationToken);
        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PantryItemResponse>> Get(
        int id,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var item = await _pantryService.GetItemAsync(userId, id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<PantryItemResponse>> Create(
        [FromBody] CreatePantryItemRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _pantryService.CreateItemAsync(userId, request, cancellationToken);
        return ToActionResult(result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<PantryItemResponse>> Update(
        int id,
        [FromBody] UpdatePantryItemRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _pantryService.UpdateItemAsync(userId, id, request, cancellationToken);
        return ToActionResult(result);
    }

    [HttpPatch("{id:int}/quantity")]
    public async Task<ActionResult<PantryItemResponse>> UpdateQuantity(
        int id,
        [FromBody] UpdatePantryQuantityRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _pantryService.UpdateQuantityAsync(userId, id, request, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var deleted = await _pantryService.DeleteItemAsync(userId, id, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("scans")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<PantryScanResponse>> Scan(
        IFormFile? image,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        if (image is null || image.Length == 0)
        {
            return BadRequest(new { errors = new[] { "Please upload an image file." } });
        }

        await using var stream = image.OpenReadStream();
        var contentType = string.IsNullOrWhiteSpace(image.ContentType)
            ? "application/octet-stream"
            : image.ContentType;

        var result = await _pantryScanService.ScanAsync(userId, stream, contentType, cancellationToken);
        return ToScanActionResult(result);
    }

    [HttpPost("scans/{scanId:int}/confirm")]
    public async Task<ActionResult<ConfirmPantryScanResponse>> ConfirmScan(
        int scanId,
        [FromBody] ConfirmPantryScanRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _pantryScanService.ConfirmAsync(userId, scanId, request, cancellationToken);
        return ToConfirmActionResult(result);
    }

    private ActionResult<PantryScanResponse> ToScanActionResult(PantryScanOperationResult result)
    {
        if (result.Invalid)
        {
            return BadRequest(new { errors = new[] { result.Error ?? "Could not scan this image." } });
        }

        return Ok(result.Scan);
    }

    private ActionResult<ConfirmPantryScanResponse> ToConfirmActionResult(PantryScanOperationResult result)
    {
        if (result.NotFound)
        {
            return NotFound(new { errors = new[] { result.Error ?? "Scan not found." } });
        }

        if (result.Forbidden)
        {
            return Forbid();
        }

        if (result.Invalid)
        {
            return BadRequest(new { errors = new[] { result.Error ?? "Could not confirm scan results." } });
        }

        return Ok(result.Confirm);
    }

    private ActionResult<PantryItemResponse> ToActionResult(PantryMutationResult result)
    {
        if (result.NotFound)
        {
            return NotFound();
        }

        if (result.Conflict)
        {
            return Conflict(new { errors = new[] { result.Error ?? "That ingredient is already in your pantry." } });
        }

        return Ok(result.Item);
    }

    private string? GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier);
}
