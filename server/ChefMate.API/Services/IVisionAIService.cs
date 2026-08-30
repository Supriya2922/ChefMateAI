namespace ChefMate.API.Services;

public interface IVisionAIService
{
    Task<VisionDetectionResult> DetectIngredientsAsync(
        Stream imageStream,
        string contentType,
        CancellationToken cancellationToken);
}
