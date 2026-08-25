using ChefMate.API.Models.Enums;

namespace ChefMate.API.DTOs.Profile;

public class ProfileResponse
{
    public required string DisplayName { get; set; }

    public required string Email { get; set; }

    public string? PhoneNumber { get; set; }

    public DietaryPreference? DietaryPreference { get; set; }

    public CookingSkill? CookingSkill { get; set; }

    public int? HouseholdSize { get; set; }

    public IReadOnlyList<string> Allergies { get; set; } = [];

    public IReadOnlyList<string> Cuisines { get; set; } = [];
}
