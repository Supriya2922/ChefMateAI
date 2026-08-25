namespace ChefMate.API.Models;

public class UserAllergy
{
    public required string UserId { get; set; }

    public int AllergyId { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public Allergy Allergy { get; set; } = null!;
}
