using ChefMate.API.Data;
using ChefMate.API.DTOs.Catalog;
using ChefMate.API.DTOs.Profile;
using ChefMate.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Services;

public class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _dbContext;

    public ProfileService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProfileResponse?> GetProfileAsync(string userId, CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .Include(u => u.Profile)
            .Include(u => u.UserAllergies)
                .ThenInclude(ua => ua.Allergy)
            .Include(u => u.UserCuisines)
                .ThenInclude(uc => uc.Cuisine)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            return null;
        }

        return MapProfile(user);
    }

    public async Task<ProfileResponse?> UpdateProfileAsync(
        string userId,
        UpdateProfileRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _dbContext.Users
            .Include(u => u.Profile)
            .Include(u => u.UserAllergies)
            .Include(u => u.UserCuisines)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user is null)
        {
            return null;
        }

        var now = DateTimeOffset.UtcNow;
        if (user.Profile is null)
        {
            user.Profile = new UserProfile
            {
                UserId = userId,
                DietaryPreference = request.DietaryPreference,
                CookingSkill = request.CookingSkill,
                HouseholdSize = request.HouseholdSize,
                CreatedAt = now,
                UpdatedAt = now
            };
        }
        else
        {
            user.Profile.DietaryPreference = request.DietaryPreference;
            user.Profile.CookingSkill = request.CookingSkill;
            user.Profile.HouseholdSize = request.HouseholdSize;
            user.Profile.UpdatedAt = now;
        }

        var allergies = await GetOrCreateAllergiesAsync(request.Allergies, cancellationToken);
        var cuisines = await GetOrCreateCuisinesAsync(request.Cuisines, cancellationToken);

        _dbContext.UserAllergies.RemoveRange(user.UserAllergies);
        _dbContext.UserCuisines.RemoveRange(user.UserCuisines);

        foreach (var allergy in allergies)
        {
            user.UserAllergies.Add(new UserAllergy
            {
                UserId = userId,
                AllergyId = allergy.Id,
                Allergy = allergy
            });
        }

        foreach (var cuisine in cuisines)
        {
            user.UserCuisines.Add(new UserCuisine
            {
                UserId = userId,
                CuisineId = cuisine.Id,
                Cuisine = cuisine
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return await GetProfileAsync(userId, cancellationToken);
    }

    public async Task<IReadOnlyList<NamedCatalogItemResponse>> GetAllergiesAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Allergies
            .AsNoTracking()
            .OrderBy(a => a.Name)
            .Select(a => new NamedCatalogItemResponse { Id = a.Id, Name = a.Name })
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<NamedCatalogItemResponse>> GetCuisinesAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Cuisines
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new NamedCatalogItemResponse { Id = c.Id, Name = c.Name })
            .ToListAsync(cancellationToken);
    }

    private async Task<List<Allergy>> GetOrCreateAllergiesAsync(
        IReadOnlyList<string> names,
        CancellationToken cancellationToken)
    {
        var normalized = NormalizeNames(names);
        if (normalized.Count == 0)
        {
            return [];
        }

        var lowerNames = normalized.Select(n => n.ToLowerInvariant()).ToList();
        var existing = await _dbContext.Allergies
            .Where(a => lowerNames.Contains(a.Name.ToLower()))
            .ToListAsync(cancellationToken);

        var existingLower = existing
            .Select(a => a.Name.ToLowerInvariant())
            .ToHashSet();

        var created = false;
        foreach (var name in normalized)
        {
            if (existingLower.Contains(name.ToLowerInvariant()))
            {
                continue;
            }

            var allergy = new Allergy { Name = name };
            _dbContext.Allergies.Add(allergy);
            existing.Add(allergy);
            existingLower.Add(name.ToLowerInvariant());
            created = true;
        }

        if (created)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return existing
            .Where(a => lowerNames.Contains(a.Name.ToLowerInvariant()))
            .ToList();
    }

    private async Task<List<Cuisine>> GetOrCreateCuisinesAsync(
        IReadOnlyList<string> names,
        CancellationToken cancellationToken)
    {
        var normalized = NormalizeNames(names);
        if (normalized.Count == 0)
        {
            return [];
        }

        var lowerNames = normalized.Select(n => n.ToLowerInvariant()).ToList();
        var existing = await _dbContext.Cuisines
            .Where(c => lowerNames.Contains(c.Name.ToLower()))
            .ToListAsync(cancellationToken);

        var existingLower = existing
            .Select(c => c.Name.ToLowerInvariant())
            .ToHashSet();

        var created = false;
        foreach (var name in normalized)
        {
            if (existingLower.Contains(name.ToLowerInvariant()))
            {
                continue;
            }

            var cuisine = new Cuisine { Name = name };
            _dbContext.Cuisines.Add(cuisine);
            existing.Add(cuisine);
            existingLower.Add(name.ToLowerInvariant());
            created = true;
        }

        if (created)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return existing
            .Where(c => lowerNames.Contains(c.Name.ToLowerInvariant()))
            .ToList();
    }

    private static List<string> NormalizeNames(IReadOnlyList<string> names)
    {
        return names
            .Select(n => n.Trim())
            .Where(n => n.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static ProfileResponse MapProfile(ApplicationUser user)
    {
        return new ProfileResponse
        {
            DisplayName = user.DisplayName,
            Email = user.Email ?? string.Empty,
            PhoneNumber = user.PhoneNumber,
            DietaryPreference = user.Profile?.DietaryPreference,
            CookingSkill = user.Profile?.CookingSkill,
            HouseholdSize = user.Profile?.HouseholdSize,
            Allergies = user.UserAllergies
                .Select(ua => ua.Allergy.Name)
                .OrderBy(n => n)
                .ToList(),
            Cuisines = user.UserCuisines
                .Select(uc => uc.Cuisine.Name)
                .OrderBy(n => n)
                .ToList()
        };
    }
}
