namespace ChefMate.API.Configuration;

public static class IngredientSynonyms
{
    private static readonly Dictionary<string, string> Map = new(StringComparer.OrdinalIgnoreCase)
    {
        ["tomatoes"] = "tomato",
        ["cherry tomatoes"] = "tomato",
        ["fresh tomato"] = "tomato",
        ["capsicum"] = "bell pepper",
        ["green pepper"] = "bell pepper",
        ["red pepper"] = "bell pepper",
        ["yellow pepper"] = "bell pepper",
        ["eggplant"] = "aubergine",
        ["cilantro"] = "coriander",
        ["spring onion"] = "green onion",
        ["scallion"] = "green onion",
        ["chilli"] = "chili pepper",
        ["chile"] = "chili pepper",
        ["yoghurt"] = "yogurt",
        ["coriander leaves"] = "coriander",
    };

    public static string Resolve(string normalizedInput)
    {
        if (Map.TryGetValue(normalizedInput, out var canonical))
        {
            return canonical;
        }

        return normalizedInput;
    }
}
