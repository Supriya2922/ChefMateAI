namespace ChefMate.API.Services;

public static class ImageFileValidator
{
    private static readonly Dictionary<string, byte[][]> Signatures = new(StringComparer.OrdinalIgnoreCase)
    {
        ["image/jpeg"] = [[0xFF, 0xD8, 0xFF]],
        ["image/png"] = [[0x89, 0x50, 0x4E, 0x47]],
        ["image/webp"] = [[0x52, 0x49, 0x46, 0x46]]
    };

    public static bool IsAllowedContentType(string contentType) =>
        Signatures.ContainsKey(NormalizeContentType(contentType));

    public static bool HasValidSignature(ReadOnlySpan<byte> bytes, string contentType)
    {
        contentType = NormalizeContentType(contentType);
        if (!Signatures.TryGetValue(contentType, out var patterns))
        {
            return false;
        }

        foreach (var pattern in patterns)
        {
            if (bytes.Length >= pattern.Length && bytes[..pattern.Length].SequenceEqual(pattern))
            {
                if (contentType == "image/webp")
                {
                    return bytes.Length >= 12 &&
                           bytes[8] == (byte)'W' &&
                           bytes[9] == (byte)'E' &&
                           bytes[10] == (byte)'B' &&
                           bytes[11] == (byte)'P';
                }

                return true;
            }
        }

        return false;
    }

    private static string NormalizeContentType(string contentType) =>
        contentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase)
            ? "image/jpeg"
            : contentType;
}
