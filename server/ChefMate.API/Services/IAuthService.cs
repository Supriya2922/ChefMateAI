using ChefMate.API.DTOs.Auth;

namespace ChefMate.API.Services;

public interface IAuthService
{
    Task<AuthOperationResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);

    Task<AuthOperationResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
}
