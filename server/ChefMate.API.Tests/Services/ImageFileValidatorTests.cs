using ChefMate.API.Services;

namespace ChefMate.API.Tests.Services;

public class ImageFileValidatorTests
{
    [Fact]
    public void HasValidSignature_ReturnsTrue_ForPngHeader()
    {
        ReadOnlySpan<byte> png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

        var valid = ImageFileValidator.HasValidSignature(png, "image/png");

        Assert.True(valid);
    }

    [Fact]
    public void HasValidSignature_ReturnsFalse_ForMismatchedContentType()
    {
        ReadOnlySpan<byte> png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

        var valid = ImageFileValidator.HasValidSignature(png, "image/jpeg");

        Assert.False(valid);
    }
}
