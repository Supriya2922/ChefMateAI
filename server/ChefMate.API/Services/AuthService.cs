using ChefMate.API.DTOs.Auth;
using ChefMate.API.Models;
using Microsoft.AspNetCore.Identity;

namespace ChefMate.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<AuthOperationResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
        {
            return AuthOperationResult.Failure("An account with this email already exists.");
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber)
                ? null
                : request.PhoneNumber.Trim()
        };

        var createResult = await _userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return AuthOperationResult.Failure(createResult.Errors.Select(e => e.Description).ToArray());
        }

        return AuthOperationResult.Success(CreateAuthResponse(user));
    }

    public async Task<AuthOperationResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return AuthOperationResult.Failure("Invalid email or password.");
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
        {
            return AuthOperationResult.Failure("Invalid email or password.");
        }

        return AuthOperationResult.Success(CreateAuthResponse(user));
    }

    private AuthResponse CreateAuthResponse(ApplicationUser user)
    {
        return new AuthResponse
        {
            Token = _tokenService.CreateToken(user),
            Email = user.Email ?? string.Empty,
            DisplayName = user.DisplayName
        };
    }
}
