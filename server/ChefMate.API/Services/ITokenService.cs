using ChefMate.API.Models;

namespace ChefMate.API.Services;

public interface ITokenService
{
    string CreateToken(ApplicationUser user);
}
