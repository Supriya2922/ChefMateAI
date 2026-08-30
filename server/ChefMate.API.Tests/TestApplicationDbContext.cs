using ChefMate.API.Data;
using ChefMate.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Tests;

internal sealed class TestApplicationDbContext : ApplicationDbContext
{
    public TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Ingredient>(entity =>
        {
            entity.Property(i => i.NormalizedName)
                .HasMaxLength(100)
                .IsRequired();
        });

        builder.Entity<PantryItem>(entity =>
        {
            entity.Property(p => p.NormalizedName)
                .HasMaxLength(100)
                .IsRequired();
        });

        builder.Entity<PantryCategory>(entity =>
        {
            entity.Property(c => c.NormalizedName)
                .HasMaxLength(100)
                .IsRequired();
        });
    }

    public static TestApplicationDbContext Create(string databaseName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

        return new TestApplicationDbContext(options);
    }

    public static Ingredient CreateIngredient(string name)
    {
        var now = DateTimeOffset.UtcNow;
        return new Ingredient
        {
            Name = name,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    public static PantryCategory CreateCategory(string userId, string name)
    {
        return new PantryCategory
        {
            UserId = userId,
            Name = name,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public static PantryItem CreatePantryItem(
        string userId,
        string name,
        PantryCategory category,
        decimal quantity,
        Models.Enums.PantryUnit unit,
        Models.Enums.PantryItemSource source)
    {
        var now = DateTimeOffset.UtcNow;
        return new PantryItem
        {
            UserId = userId,
            Name = name,
            Quantity = quantity,
            Unit = unit,
            Category = category,
            Source = source,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    public static void StampNormalizedNames(ApplicationDbContext context)
    {
        foreach (var entry in context.ChangeTracker.Entries<Ingredient>())
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
            {
                entry.Property(nameof(Ingredient.NormalizedName)).CurrentValue =
                    entry.Entity.Name.ToLowerInvariant();
            }
        }

        foreach (var entry in context.ChangeTracker.Entries<PantryItem>())
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
            {
                entry.Property(nameof(PantryItem.NormalizedName)).CurrentValue =
                    entry.Entity.Name.ToLowerInvariant();
            }
        }

        foreach (var entry in context.ChangeTracker.Entries<PantryCategory>())
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
            {
                entry.Property(nameof(PantryCategory.NormalizedName)).CurrentValue =
                    entry.Entity.Name.ToLowerInvariant();
            }
        }
    }
}
