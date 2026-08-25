namespace ChefMate.API.Models;

public class Allergy
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public ICollection<UserAllergy> UserAllergies { get; set; } = new List<UserAllergy>();
}
