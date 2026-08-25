namespace ChefMate.API.Models;

public class Cuisine
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public ICollection<UserCuisine> UserCuisines { get; set; } = new List<UserCuisine>();
}
