using ChefMate.API.Models.Enums;
using ChefMate.API.Services;
using ChefMate.API.Tests;
using Microsoft.EntityFrameworkCore;

namespace ChefMate.API.Tests.Services;

public class PantryServiceScanTests
{
    [Fact]
    public async Task UpsertFromScanAsync_MergesQuantity_WhenIngredientAlreadyInPantry()
    {
        await using var context = TestApplicationDbContext.Create(Guid.NewGuid().ToString());
        var userId = "user-1";
        SeedUserPantry(context, userId, out var ingredient, out var existingItem);
        var service = new PantryService(context);

        var result = await service.UpsertFromScanAsync(
            userId,
            ingredient,
            quantity: 2,
            unit: PantryUnit.Piece,
            CancellationToken.None);

        Assert.Equal(existingItem.Id, result.Id);
        Assert.Equal(5, result.Quantity);
        Assert.Equal(PantryItemSource.PantryScan, result.Source);
    }

    [Fact]
    public async Task UpsertFromScanAsync_CreatesNewItem_WhenIngredientNotInPantry()
    {
        await using var context = TestApplicationDbContext.Create(Guid.NewGuid().ToString());
        var userId = "user-1";
        var ingredient = TestApplicationDbContext.CreateIngredient("Milk");
        context.Ingredients.Add(ingredient);
        context.PantryCategories.Add(TestApplicationDbContext.CreateCategory(userId, "Other"));
        TestApplicationDbContext.StampNormalizedNames(context);
        await context.SaveChangesAsync();

        var service = new PantryService(context);
        var result = await service.UpsertFromScanAsync(
            userId,
            ingredient,
            quantity: 1,
            unit: PantryUnit.Liter,
            CancellationToken.None);

        Assert.Equal("Milk", result.Name);
        Assert.Equal(1, result.Quantity);
        Assert.Equal(PantryItemSource.PantryScan, result.Source);
    }

    private static void SeedUserPantry(
        TestApplicationDbContext context,
        string userId,
        out Models.Ingredient ingredient,
        out Models.PantryItem existingItem)
    {
        ingredient = TestApplicationDbContext.CreateIngredient("Tomato");
        var category = TestApplicationDbContext.CreateCategory(userId, "Produce");
        existingItem = TestApplicationDbContext.CreatePantryItem(
            userId,
            "Tomato",
            category,
            quantity: 3,
            unit: PantryUnit.Piece,
            source: PantryItemSource.Manual);

        context.Ingredients.Add(ingredient);
        context.PantryCategories.Add(category);
        context.PantryItems.Add(existingItem);
        TestApplicationDbContext.StampNormalizedNames(context);
        context.SaveChanges();
        existingItem.IngredientId = ingredient.Id;
        context.SaveChanges();
    }
}
