using ChefMate.API.DTOs.Auth;

namespace ChefMate.API.Services;

public class AuthOperationResult
{
    public bool Succeeded { get; init; }

    public AuthResponse? Response { get; init; }

    public IReadOnlyList<string> Errors { get; init; } = [];

    public static AuthOperationResult Success(AuthResponse response) =>
        new() { Succeeded = true, Response = response };

    public static AuthOperationResult Failure(params string[] errors) =>
        new() { Succeeded = false, Errors = errors };
}
