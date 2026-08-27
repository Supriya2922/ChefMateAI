using ChefMate.API.Models.Enums;

namespace ChefMate.API.Models;

public static class PantryExpiry
{
    public const int ExpiringSoonDays = 7;

    public static (ExpiryStatus Status, int? DaysUntilExpiry) Evaluate(
        DateOnly? expiryDate,
        DateOnly today)
    {
        if (expiryDate is null)
        {
            return (ExpiryStatus.None, null);
        }

        var days = expiryDate.Value.DayNumber - today.DayNumber;
        var status = days < 0
            ? ExpiryStatus.Expired
            : days <= ExpiringSoonDays
                ? ExpiryStatus.ExpiringSoon
                : ExpiryStatus.Fresh;

        return (status, days);
    }
}
