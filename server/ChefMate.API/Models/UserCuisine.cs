namespace ChefMate.API.Models;

public class UserCuisine
{
    public required string UserId { get; set; }

    public int CuisineId { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public Cuisine Cuisine { get; set; } = null!;
}
