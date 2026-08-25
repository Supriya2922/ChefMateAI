using Microsoft.AspNetCore.Identity;

namespace ChefMate.API.Models;

public class ApplicationUser : IdentityUser
{
    public required string DisplayName { get; set; }

    public UserProfile? Profile { get; set; }

    public ICollection<UserAllergy> UserAllergies { get; set; } = new List<UserAllergy>();

    public ICollection<UserCuisine> UserCuisines { get; set; } = new List<UserCuisine>();
}
