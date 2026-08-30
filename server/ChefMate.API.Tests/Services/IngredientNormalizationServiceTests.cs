using ChefMate.API.Services;
using ChefMate.API.Tests;

namespace ChefMate.API.Tests.Services;

public class IngredientNormalizationServiceTests
{
    [Theory]
    [InlineData("Tomatoes", "tomato")]
    [InlineData("  Fresh Tomato ", "tomato")]
    [InlineData("CAPSICUM", "bell pepper")]
    [InlineData("Green Pepper", "bell pepper")]
    public void NormalizeToken_AppliesSynonymsAndSingularization(string input, string expected)
    {
        var service = CreateService();

        var normalized = service.NormalizeToken(input);

        Assert.Equal(expected, normalized);
    }

    [Fact]
    public async Task NormalizeAsync_ReturnsExistingIngredient_WhenNormalizedNameMatches()
    {
        await using var context = TestApplicationDbContext.Create(Guid.NewGuid().ToString());
        context.Ingredients.Add(TestApplicationDbContext.CreateIngredient("Tomato"));
        TestApplicationDbContext.StampNormalizedNames(context);
        await context.SaveChangesAsync();

        var service = new IngredientNormalizationService(context);
        var result = await service.NormalizeAsync("Tomatoes", CancellationToken.None);

        Assert.Equal("Tomato", result.Name);
        Assert.Single(context.Ingredients);
    }

    [Fact]
    public async Task NormalizeAsync_CreatesIngredient_WhenNoMatchExists()
    {
        await using var context = TestApplicationDbContext.Create(Guid.NewGuid().ToString());
        var service = new IngredientNormalizationService(context);

        var result = await service.NormalizeAsync("Dragon Fruit", CancellationToken.None);

        Assert.Equal("Dragon Fruit", result.Name);
        Assert.Equal(1, await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.CountAsync(context.Ingredients));
    }

    private static IngredientNormalizationService CreateService()
    {
        return new IngredientNormalizationService(TestApplicationDbContext.Create(Guid.NewGuid().ToString()));
    }
}
