using ChefMate.API.Models.Enums;

namespace ChefMate.API.Models;

public class PantryScan
{
    public int Id { get; set; }

    public required string UserId { get; set; }

    public string? ImageUrl { get; set; }

    public PantryScanStatus Status { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? CompletedAt { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public ICollection<PantryScanItem> Items { get; set; } = new List<PantryScanItem>();
}
