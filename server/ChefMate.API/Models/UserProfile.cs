using ChefMate.API.Models.Enums;

namespace ChefMate.API.Models;

public class UserProfile
{
    public int Id { get; set; }

    public required string UserId { get; set; }

    public DietaryPreference DietaryPreference { get; set; }

    public CookingSkill CookingSkill { get; set; }

    public int HouseholdSize { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;
}
