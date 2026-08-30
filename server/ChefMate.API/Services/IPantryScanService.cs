using ChefMate.API.DTOs.Pantry;

namespace ChefMate.API.Services;

public class PantryScanOperationResult
{
    public bool NotFound { get; init; }

    public bool Forbidden { get; init; }

    public bool Invalid { get; init; }

    public string? Error { get; init; }

    public PantryScanResponse? Scan { get; init; }

    public ConfirmPantryScanResponse? Confirm { get; init; }

    public static PantryScanOperationResult Success(PantryScanResponse scan) =>
        new() { Scan = scan };

    public static PantryScanOperationResult ConfirmSuccess(ConfirmPantryScanResponse confirm) =>
        new() { Confirm = confirm };

    public static PantryScanOperationResult Missing() =>
        new() { NotFound = true, Error = "Scan not found." };

    public static PantryScanOperationResult Denied() =>
        new() { Forbidden = true, Error = "You do not have access to this scan." };

    public static PantryScanOperationResult Failure(string message) =>
        new() { Invalid = true, Error = message };
}

public interface IPantryScanService
{
    Task<PantryScanOperationResult> ScanAsync(
        string userId,
        Stream imageStream,
        string contentType,
        CancellationToken cancellationToken);

    Task<PantryScanOperationResult> ConfirmAsync(
        string userId,
        int scanId,
        ConfirmPantryScanRequest request,
        CancellationToken cancellationToken);
}
