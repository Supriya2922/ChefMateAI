import { writeFileSync } from "node:fs";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const OUTPUT_FILE = "recipes.json";

const CATEGORY_LIMITS = {
  Chicken: 6,
  Beef: 4,
  Vegetarian: 8,
  Seafood: 5,
  Pasta: 5,
  Dessert: 5,
  Breakfast: 5,
  Lamb: 3,
  Pork: 2,
  Goat: 1,
  Miscellaneous: 6,
};

async function getJson(url, params = {}) {
  const query = new URLSearchParams(params).toString();
  const fullUrl = query ? `${url}?${query}` : url;
  const response = await fetch(fullUrl, { signal: AbortSignal.timeout(15000) });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${fullUrl}`);
  }

  return response.json();
}

async function getCategoryMeals(category) {
  const data = await getJson(`${BASE_URL}/filter.php`, { c: category });
  return data.meals ?? [];
}

async function getRecipeDetails(mealId) {
  const data = await getJson(`${BASE_URL}/lookup.php`, { i: mealId });
  return data.meals?.[0] ?? null;
}

function extractIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient?.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        quantity: measure?.trim() ?? "",
      });
    }
  }

  return ingredients;
}

function cleanTags(tags) {
  if (!tags) {
    return [];
  }

  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function deriveMealType(category, title) {
  const categoryLower = category.toLowerCase();
  const titleLower = title.toLowerCase();

  if (categoryLower === "dessert") {
    return "Dessert";
  }

  if (categoryLower === "breakfast") {
    return "Breakfast";
  }

  if (["salad", "soup", "sandwich", "wrap"].some((word) => titleLower.includes(word))) {
    return "Lunch";
  }

  return "Dinner";
}

function deriveDiet(category, title, ingredients) {
  const categoryLower = category.toLowerCase();
  const titleLower = title.toLowerCase();

  if (categoryLower === "vegetarian") {
    return "Vegetarian";
  }

  const meatWords = [
    "chicken",
    "beef",
    "pork",
    "lamb",
    "goat",
    "turkey",
    "duck",
    "fish",
    "salmon",
    "tuna",
    "prawn",
    "shrimp",
    "anchovy",
  ];

  const ingredientText = ingredients.map((item) => item.name.toLowerCase()).join(" ");
  const combined = `${titleLower} ${ingredientText}`;

  if (meatWords.some((word) => combined.includes(word))) {
    return "Non-Vegetarian";
  }

  return "Vegetarian";
}

function deriveDifficulty(ingredients, instructions) {
  const ingredientCount = ingredients.length;
  const instructionLength = instructions?.length ?? 0;

  if (ingredientCount <= 6 && instructionLength < 800) {
    return "Easy";
  }

  if (ingredientCount <= 12 && instructionLength < 1600) {
    return "Medium";
  }

  return "Hard";
}

function deriveCookTimeMinutes(title, difficulty) {
  const match = title.match(/(\d+)\s*-?\s*(?:minute|min)\b/i);

  if (match) {
    return Number(match[1]);
  }

  if (difficulty === "Easy") {
    return 25;
  }

  if (difficulty === "Hard") {
    return 60;
  }

  return 45;
}

function deriveCalories(mealType, category) {
  const categoryLower = category.toLowerCase();

  if (mealType === "Dessert" || categoryLower === "dessert") {
    return 350;
  }

  if (mealType === "Breakfast" || categoryLower === "breakfast") {
    return 400;
  }

  if (categoryLower === "seafood" || categoryLower === "vegetarian") {
    return 450;
  }

  return 550;
}

function transformRecipe(meal) {
  const ingredients = extractIngredients(meal);
  const category = meal.strCategory ?? "Miscellaneous";
  const title = meal.strMeal ?? "Unknown Recipe";
  const instructions = meal.strInstructions ?? "";
  const mealType = deriveMealType(category, title);
  const difficulty = deriveDifficulty(ingredients, instructions);

  return {
    externalId: meal.idMeal,
    title,
    description: `${title} - a ${category.toLowerCase()} recipe from ${meal.strArea ?? "international"} cuisine.`,
    imageUrl: meal.strMealThumb,
    instructions: instructions.trim(),
    cuisine: meal.strArea ?? "International",
    category,
    mealType,
    diet: deriveDiet(category, title, ingredients),
    difficulty,
    cookTimeMinutes: deriveCookTimeMinutes(title, difficulty),
    calories: deriveCalories(mealType, category),
    ingredients,
    tags: cleanTags(meal.strTags),
    youtubeUrl: meal.strYoutube,
    source: "TheMealDB",
    isAiGenerated: false,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const recipes = new Map();

  console.log("\nChefMate AI Recipe Importer");
  console.log("-----------------------------------");

  for (const [category, limit] of Object.entries(CATEGORY_LIMITS)) {
    console.log(`\nFetching category: ${category}`);

    let meals;

    try {
      meals = await getCategoryMeals(category);
    } catch (error) {
      console.log(`Failed: ${error.message}`);
      continue;
    }

    let count = 0;

    for (const meal of meals) {
      if (recipes.size >= 50) {
        break;
      }

      const mealId = meal.idMeal;

      if (!mealId || recipes.has(mealId)) {
        continue;
      }

      try {
        console.log(`  -> Fetching ${meal.strMeal}`);

        const fullRecipe = await getRecipeDetails(mealId);

        if (!fullRecipe) {
          continue;
        }

        recipes.set(mealId, transformRecipe(fullRecipe));
        count += 1;

        await sleep(150);

        if (count >= limit) {
          break;
        }
      } catch (error) {
        console.log(`  Skipping ${mealId}: ${error.message}`);
      }
    }

    console.log(`  Added ${count} recipes`);

    if (recipes.size >= 50) {
      break;
    }
  }

  const finalRecipes = [...recipes.values()].slice(0, 50);

  writeFileSync(OUTPUT_FILE, JSON.stringify(finalRecipes, null, 2), "utf8");

  console.log("\n-----------------------------------");
  console.log(`DONE! Created ${finalRecipes.length} recipes.`);
  console.log(`File: ${OUTPUT_FILE}`);

  console.log("\nRecipe distribution:");

  const categoryCounts = finalRecipes.reduce((counts, recipe) => {
    counts[recipe.category] = (counts[recipe.category] ?? 0) + 1;
    return counts;
  }, {});

  for (const [category, count] of Object.entries(categoryCounts)) {
    console.log(`  ${category}: ${count}`);
  }

  console.log("\nChefMate recipe dataset ready!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
