using ChefMate.API.Data;
using ChefMate.API.DTOs.Pantry;
using ChefMate.API.Models;
using ChefMate.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Services;

public class PantryService : IPantryService
{
    private static readonly string[] DefaultCategories =
    [
        "Produce",
        "Dairy",
        "Protein",
        "Grains",
        "Spices",
        "Condiments",
        "Frozen",
        "Beverages",
        "Other"
    ];

    private readonly ApplicationDbContext _dbContext;

    public PantryService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PantryListResponse> ListItemsAsync(
        string userId,
        PantryListQuery query,
        CancellationToken cancellationToken)
    {
        await EnsureDefaultCategoriesAsync(userId, cancellationToken);

        var today = TodayUtc();
        var itemsQuery = _dbContext.PantryItems
            .AsNoTracking()
            .Include(item => item.Category)
            .Where(item => item.UserId == userId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = $"%{EscapeLike(query.Search.Trim())}%";
            itemsQuery = itemsQuery.Where(item => EF.Functions.ILike(item.Name, term, "\\"));
        }

        if (query.CategoryId is int categoryId)
        {
            itemsQuery = itemsQuery.Where(item => item.CategoryId == categoryId);
        }

        if (query.ExpiryStatus is ExpiryStatus expiryStatus)
        {
            itemsQuery = ApplyExpiryFilter(itemsQuery, expiryStatus, today);
        }

        itemsQuery = ApplySort(itemsQuery, query.Sort);

        var items = await itemsQuery.ToListAsync(cancellationToken);
        var summary = await BuildSummaryAsync(userId, today, cancellationToken);

        return new PantryListResponse
        {
            Items = items.Select(item => MapItem(item, today)).ToList(),
            Summary = summary
        };
    }

    public async Task<IReadOnlyList<PantryCategoryResponse>> GetCategoriesAsync(
        string userId,
        CancellationToken cancellationToken)
    {
        await EnsureDefaultCategoriesAsync(userId, cancellationToken);

        return await _dbContext.PantryCategories
            .AsNoTracking()
            .Where(category => category.UserId == userId)
            .OrderBy(category => category.Name)
            .Select(category => new PantryCategoryResponse { Id = category.Id, Name = category.Name })
            .ToListAsync(cancellationToken);
    }

    public async Task<PantryItemResponse?> GetItemAsync(
        string userId,
        int id,
        CancellationToken cancellationToken)
    {
        var item = await _dbContext.PantryItems
            .AsNoTracking()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId, cancellationToken);

        return item is null ? null : MapItem(item, TodayUtc());
    }

    public async Task<PantryMutationResult> CreateItemAsync(
        string userId,
        CreatePantryItemRequest request,
        CancellationToken cancellationToken)
    {
        await EnsureDefaultCategoriesAsync(userId, cancellationToken);

        var name = NormalizeName(request.Name);
        if (await NameTakenAsync(userId, name, excludeId: null, cancellationToken))
        {
            return PantryMutationResult.Duplicate(name);
        }

        var category = await GetOrCreateCategoryAsync(userId, request.CategoryName, cancellationToken);
        var now = DateTimeOffset.UtcNow;
        var item = new PantryItem
        {
            UserId = userId,
            Name = name,
            Quantity = request.Quantity,
            Unit = request.Unit,
            CategoryId = category.Id,
            Category = category,
            ExpiryDate = request.ExpiryDate,
            Source = PantryItemSource.Manual,
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.PantryItems.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return PantryMutationResult.Success(MapItem(item, TodayUtc()));
    }

    public async Task<PantryMutationResult> UpdateItemAsync(
        string userId,
        int id,
        UpdatePantryItemRequest request,
        CancellationToken cancellationToken)
    {
        var item = await _dbContext.PantryItems
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId, cancellationToken);

        if (item is null)
        {
            return PantryMutationResult.Missing();
        }

        var name = NormalizeName(request.Name);
        if (await NameTakenAsync(userId, name, excludeId: id, cancellationToken))
        {
            return PantryMutationResult.Duplicate(name);
        }

        var category = await GetOrCreateCategoryAsync(userId, request.CategoryName, cancellationToken);

        item.Name = name;
        item.Quantity = request.Quantity;
        item.Unit = request.Unit;
        item.CategoryId = category.Id;
        item.Category = category;
        item.ExpiryDate = request.ExpiryDate;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return PantryMutationResult.Success(MapItem(item, TodayUtc()));
    }

    public async Task<PantryMutationResult> UpdateQuantityAsync(
        string userId,
        int id,
        UpdatePantryQuantityRequest request,
        CancellationToken cancellationToken)
    {
        var item = await _dbContext.PantryItems
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId, cancellationToken);

        if (item is null)
        {
            return PantryMutationResult.Missing();
        }

        item.Quantity = request.Quantity;
        item.UpdatedAt = DateTimeOffset.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return PantryMutationResult.Success(MapItem(item, TodayUtc()));
    }

    public async Task<bool> DeleteItemAsync(string userId, int id, CancellationToken cancellationToken)
    {
        var item = await _dbContext.PantryItems
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId, cancellationToken);

        if (item is null)
        {
            return false;
        }

        _dbContext.PantryItems.Remove(item);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<PantryItemResponse> UpsertFromScanAsync(
        string userId,
        Ingredient ingredient,
        decimal quantity,
        PantryUnit unit,
        CancellationToken cancellationToken)
    {
        await EnsureDefaultCategoriesAsync(userId, cancellationToken);

        var existing = await _dbContext.PantryItems
            .Include(item => item.Category)
            .FirstOrDefaultAsync(
                item => item.UserId == userId &&
                        (item.IngredientId == ingredient.Id ||
                         item.NormalizedName == ingredient.NormalizedName),
                cancellationToken);

        var now = DateTimeOffset.UtcNow;

        if (existing is not null)
        {
            if (existing.Unit == unit)
            {
                existing.Quantity += quantity;
            }
            else
            {
                existing.Quantity = quantity;
                existing.Unit = unit;
            }

            existing.IngredientId ??= ingredient.Id;
            existing.Name = ingredient.Name;
            existing.Source = PantryItemSource.PantryScan;
            existing.UpdatedAt = now;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return MapItem(existing, TodayUtc());
        }

        var categoryName = string.IsNullOrWhiteSpace(ingredient.Category) ? "Other" : ingredient.Category;
        var category = await GetOrCreateCategoryAsync(userId, categoryName, cancellationToken);

        var item = new PantryItem
        {
            UserId = userId,
            Name = ingredient.Name,
            IngredientId = ingredient.Id,
            Quantity = quantity,
            Unit = unit,
            CategoryId = category.Id,
            Category = category,
            Source = PantryItemSource.PantryScan,
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.PantryItems.Add(item);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapItem(item, TodayUtc());
    }

    private async Task EnsureDefaultCategoriesAsync(string userId, CancellationToken cancellationToken)
    {
        var existing = await _dbContext.PantryCategories
            .Where(category => category.UserId == userId)
            .ToListAsync(cancellationToken);

        var existingNames = existing
            .Select(category => category.Name.ToLowerInvariant())
            .ToHashSet();

        var now = DateTimeOffset.UtcNow;
        var created = false;

        foreach (var name in DefaultCategories)
        {
            if (existingNames.Contains(name.ToLowerInvariant()))
            {
                continue;
            }

            _dbContext.PantryCategories.Add(new PantryCategory
            {
                UserId = userId,
                Name = name,
                CreatedAt = now
            });
            existingNames.Add(name.ToLowerInvariant());
            created = true;
        }

        if (created)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task<PantryCategory> GetOrCreateCategoryAsync(
        string userId,
        string categoryName,
        CancellationToken cancellationToken)
    {
        var name = NormalizeName(categoryName);
        var existing = await _dbContext.PantryCategories
            .FirstOrDefaultAsync(
                category => category.UserId == userId && category.NormalizedName == name.ToLowerInvariant(),
                cancellationToken);

        if (existing is not null)
        {
            return existing;
        }

        var category = new PantryCategory
        {
            UserId = userId,
            Name = name,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.PantryCategories.Add(category);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return category;
    }

    private async Task<bool> NameTakenAsync(
        string userId,
        string name,
        int? excludeId,
        CancellationToken cancellationToken)
    {
        var normalized = name.ToLowerInvariant();
        var query = _dbContext.PantryItems.Where(item =>
            item.UserId == userId && item.NormalizedName == normalized);

        if (excludeId is int id)
        {
            query = query.Where(item => item.Id != id);
        }

        return await query.AnyAsync(cancellationToken);
    }

    private async Task<PantrySummaryResponse> BuildSummaryAsync(
        string userId,
        DateOnly today,
        CancellationToken cancellationToken)
    {
        var expiryDates = await _dbContext.PantryItems
            .AsNoTracking()
            .Where(item => item.UserId == userId)
            .Select(item => item.ExpiryDate)
            .ToListAsync(cancellationToken);

        var expiringSoon = 0;
        var expired = 0;

        foreach (var expiryDate in expiryDates)
        {
            var (status, _) = PantryExpiry.Evaluate(expiryDate, today);
            if (status == ExpiryStatus.ExpiringSoon)
            {
                expiringSoon++;
            }
            else if (status == ExpiryStatus.Expired)
            {
                expired++;
            }
        }

        return new PantrySummaryResponse
        {
            TotalCount = expiryDates.Count,
            ExpiringSoonCount = expiringSoon,
            ExpiredCount = expired
        };
    }

    private static IQueryable<PantryItem> ApplyExpiryFilter(
        IQueryable<PantryItem> query,
        ExpiryStatus status,
        DateOnly today)
    {
        var soonLimit = today.AddDays(PantryExpiry.ExpiringSoonDays);

        return status switch
        {
            ExpiryStatus.None => query.Where(item => item.ExpiryDate == null),
            ExpiryStatus.Expired => query.Where(item => item.ExpiryDate != null && item.ExpiryDate < today),
            ExpiryStatus.ExpiringSoon => query.Where(item =>
                item.ExpiryDate != null && item.ExpiryDate >= today && item.ExpiryDate <= soonLimit),
            ExpiryStatus.Fresh => query.Where(item => item.ExpiryDate != null && item.ExpiryDate > soonLimit),
            _ => query
        };
    }

    private static IQueryable<PantryItem> ApplySort(IQueryable<PantryItem> query, string? sort)
    {
        return sort switch
        {
            "-name" => query.OrderByDescending(item => item.Name),
            "expiryDate" => query
                .OrderBy(item => item.ExpiryDate == null)
                .ThenBy(item => item.ExpiryDate)
                .ThenBy(item => item.Name),
            "-expiryDate" => query
                .OrderBy(item => item.ExpiryDate == null)
                .ThenByDescending(item => item.ExpiryDate)
                .ThenBy(item => item.Name),
            _ => query.OrderBy(item => item.Name)
        };
    }

    private static PantryItemResponse MapItem(PantryItem item, DateOnly today)
    {
        var (status, daysUntilExpiry) = PantryExpiry.Evaluate(item.ExpiryDate, today);

        return new PantryItemResponse
        {
            Id = item.Id,
            IngredientId = item.IngredientId,
            Name = item.Name,
            Quantity = item.Quantity,
            Unit = item.Unit,
            Category = new PantryCategoryResponse
            {
                Id = item.Category.Id,
                Name = item.Category.Name
            },
            ExpiryDate = item.ExpiryDate,
            ExpiryStatus = status,
            DaysUntilExpiry = daysUntilExpiry,
            Source = item.Source,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }

    private static string NormalizeName(string name) => name.Trim();

    private static DateOnly TodayUtc() => DateOnly.FromDateTime(DateTime.UtcNow);

    private static string EscapeLike(string value) =>
        value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("%", "\\%", StringComparison.Ordinal)
            .Replace("_", "\\_", StringComparison.Ordinal);
}
