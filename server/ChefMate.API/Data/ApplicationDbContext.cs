using ChefMate.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();

    public DbSet<Allergy> Allergies => Set<Allergy>();

    public DbSet<Cuisine> Cuisines => Set<Cuisine>();

    public DbSet<UserAllergy> UserAllergies => Set<UserAllergy>();

    public DbSet<UserCuisine> UserCuisines => Set<UserCuisine>();

    public DbSet<PantryCategory> PantryCategories => Set<PantryCategory>();

    public DbSet<PantryItem> PantryItems => Set<PantryItem>();

    public DbSet<Recipe> Recipes => Set<Recipe>();

    public DbSet<Ingredient> Ingredients => Set<Ingredient>();

    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();

    public DbSet<Tag> Tags => Set<Tag>();

    public DbSet<RecipeTag> RecipeTags => Set<RecipeTag>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(u => u.DisplayName)
                .HasMaxLength(100)
                .IsRequired();
        });

        builder.Entity<UserProfile>(entity =>
        {
            entity.ToTable(t =>
                t.HasCheckConstraint("CK_UserProfiles_HouseholdSize", "\"HouseholdSize\" >= 1"));

            entity.HasIndex(p => p.UserId).IsUnique();

            entity.Property(p => p.DietaryPreference)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.Property(p => p.CookingSkill)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Allergy>(entity =>
        {
            entity.Property(a => a.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasIndex(a => a.Name).IsUnique();

            entity.HasData(
                new Allergy { Id = 1, Name = "Peanuts" },
                new Allergy { Id = 2, Name = "Tree nuts" },
                new Allergy { Id = 3, Name = "Milk" },
                new Allergy { Id = 4, Name = "Eggs" },
                new Allergy { Id = 5, Name = "Wheat" },
                new Allergy { Id = 6, Name = "Soy" },
                new Allergy { Id = 7, Name = "Shellfish" },
                new Allergy { Id = 8, Name = "Fish" },
                new Allergy { Id = 9, Name = "Sesame" });
        });

        builder.Entity<Cuisine>(entity =>
        {
            entity.Property(c => c.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasIndex(c => c.Name).IsUnique();

            entity.HasData(
                new Cuisine { Id = 1, Name = "Indian" },
                new Cuisine { Id = 2, Name = "Italian" },
                new Cuisine { Id = 3, Name = "Thai" },
                new Cuisine { Id = 4, Name = "Chinese" },
                new Cuisine { Id = 5, Name = "Mexican" },
                new Cuisine { Id = 6, Name = "Japanese" },
                new Cuisine { Id = 7, Name = "Mediterranean" },
                new Cuisine { Id = 8, Name = "American" });
        });

        builder.Entity<UserAllergy>(entity =>
        {
            entity.HasKey(ua => new { ua.UserId, ua.AllergyId });

            entity.HasOne(ua => ua.User)
                .WithMany(u => u.UserAllergies)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ua => ua.Allergy)
                .WithMany(a => a.UserAllergies)
                .HasForeignKey(ua => ua.AllergyId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<UserCuisine>(entity =>
        {
            entity.HasKey(uc => new { uc.UserId, uc.CuisineId });

            entity.HasOne(uc => uc.User)
                .WithMany(u => u.UserCuisines)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(uc => uc.Cuisine)
                .WithMany(c => c.UserCuisines)
                .HasForeignKey(uc => uc.CuisineId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<PantryCategory>(entity =>
        {
            entity.Property(c => c.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(c => c.NormalizedName)
                .HasMaxLength(100)
                .HasComputedColumnSql("lower(\"Name\")", stored: true);

            entity.HasIndex(c => new { c.UserId, c.NormalizedName })
                .IsUnique();

            entity.HasOne(c => c.User)
                .WithMany(u => u.PantryCategories)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<PantryItem>(entity =>
        {
            entity.ToTable(t =>
                t.HasCheckConstraint("CK_PantryItems_Quantity", "\"Quantity\" >= 0"));

            entity.Property(p => p.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(p => p.NormalizedName)
                .HasMaxLength(100)
                .HasComputedColumnSql("lower(\"Name\")", stored: true);

            entity.Property(p => p.Quantity)
                .HasPrecision(10, 2);

            entity.Property(p => p.Unit)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.HasIndex(p => new { p.UserId, p.NormalizedName })
                .IsUnique();

            entity.HasOne(p => p.User)
                .WithMany(u => u.PantryItems)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Recipe>(entity =>
        {
            entity.Property(r => r.ExternalId)
                .HasMaxLength(32)
                .IsRequired();

            entity.HasIndex(r => r.ExternalId)
                .IsUnique();

            entity.Property(r => r.Title)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(r => r.Description)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(r => r.ImageUrl)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(r => r.CuisineName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(r => r.CategoryName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(r => r.MealType)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.Property(r => r.Diet)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.Property(r => r.Difficulty)
                .HasConversion<string>()
                .HasMaxLength(32)
                .IsRequired();

            entity.Property(r => r.YoutubeUrl)
                .HasMaxLength(500);

            entity.Property(r => r.Source)
                .HasMaxLength(100)
                .IsRequired();
        });

        builder.Entity<Ingredient>(entity =>
        {
            entity.Property(i => i.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(i => i.NormalizedName)
                .HasMaxLength(100)
                .HasComputedColumnSql("lower(\"Name\")", stored: true);

            entity.HasIndex(i => i.NormalizedName)
                .IsUnique();
        });

        builder.Entity<RecipeIngredient>(entity =>
        {
            entity.HasKey(ri => new { ri.RecipeId, ri.IngredientId });

            entity.Property(ri => ri.Quantity)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasOne(ri => ri.Recipe)
                .WithMany(r => r.RecipeIngredients)
                .HasForeignKey(ri => ri.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ri => ri.Ingredient)
                .WithMany(i => i.RecipeIngredients)
                .HasForeignKey(ri => ri.IngredientId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Tag>(entity =>
        {
            entity.Property(t => t.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(t => t.NormalizedName)
                .HasMaxLength(100)
                .HasComputedColumnSql("lower(\"Name\")", stored: true);

            entity.HasIndex(t => t.NormalizedName)
                .IsUnique();
        });

        builder.Entity<RecipeTag>(entity =>
        {
            entity.HasKey(rt => new { rt.RecipeId, rt.TagId });

            entity.HasOne(rt => rt.Recipe)
                .WithMany(r => r.RecipeTags)
                .HasForeignKey(rt => rt.RecipeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(rt => rt.Tag)
                .WithMany(t => t.RecipeTags)
                .HasForeignKey(rt => rt.TagId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
