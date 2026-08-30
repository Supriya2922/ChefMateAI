using Microsoft.AspNetCore.Identity;

namespace ChefMate.API.Models;

public class ApplicationUser : IdentityUser
{
    public required string DisplayName { get; set; }

    public UserProfile? Profile { get; set; }

    public ICollection<UserAllergy> UserAllergies { get; set; } = new List<UserAllergy>();

    public ICollection<UserCuisine> UserCuisines { get; set; } = new List<UserCuisine>();

    public ICollection<PantryItem> PantryItems { get; set; } = new List<PantryItem>();

    public ICollection<PantryCategory> PantryCategories { get; set; } = new List<PantryCategory>();

    public ICollection<PantryScan> PantryScans { get; set; } = new List<PantryScan>();
}
