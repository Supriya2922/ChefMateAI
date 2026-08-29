import requests
import json
import time
from collections import OrderedDict

BASE_URL = "https://www.themealdb.com/api/json/v1/1"

OUTPUT_FILE = "recipes.json"

# We deliberately select from different categories.
# The script will collect recipes from these groups
# and stop when it reaches 50 unique recipes.

CATEGORY_LIMITS = {
    "Chicken": 6,
    "Beef": 4,
    "Vegetarian": 8,
    "Seafood": 5,
    "Pasta": 5,
    "Dessert": 5,
    "Breakfast": 5,
    "Lamb": 3,
    "Pork": 2,
    "Goat": 1,
    "Miscellaneous": 6
}

# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------

def get_json(url, params=None):
    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    return response.json()


def get_category_meals(category):
    data = get_json(
        f"{BASE_URL}/filter.php",
        {"c": category}
    )

    return data.get("meals") or []


def get_recipe_details(meal_id):
    data = get_json(
        f"{BASE_URL}/lookup.php",
        {"i": meal_id}
    )

    meals = data.get("meals")

    if not meals:
        return None

    return meals[0]


def extract_ingredients(meal):
    ingredients = []

    for i in range(1, 21):
        ingredient = meal.get(f"strIngredient{i}")
        measure = meal.get(f"strMeasure{i}")

        if ingredient and ingredient.strip():
            ingredients.append({
                "name": ingredient.strip(),
                "quantity": measure.strip() if measure else ""
            })

    return ingredients


def clean_tags(tags):
    if not tags:
        return []

    return [
        tag.strip()
        for tag in tags.split(",")
        if tag.strip()
    ]


def derive_meal_type(category, title):
    category = category.lower()
    title = title.lower()

    if category == "dessert":
        return "Dessert"

    if category == "breakfast":
        return "Breakfast"

    if any(word in title for word in [
        "salad",
        "soup",
        "sandwich",
        "wrap"
    ]):
        return "Lunch"

    return "Dinner"


def derive_diet(category, title, ingredients):
    category = category.lower()
    title = title.lower()

    if category == "vegetarian":
        return "Vegetarian"

    meat_words = [
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
        "anchovy"
    ]

    ingredient_text = " ".join(
        item["name"].lower()
        for item in ingredients
    )

    combined = title + " " + ingredient_text

    if any(word in combined for word in meat_words):
        return "Non-Vegetarian"

    return "Vegetarian"


def derive_difficulty(ingredients, instructions):
    ingredient_count = len(ingredients)
    instruction_length = len(instructions or "")

    if ingredient_count <= 6 and instruction_length < 800:
        return "Easy"

    if ingredient_count <= 12 and instruction_length < 1600:
        return "Medium"

    return "Hard"


def derive_cook_time_minutes(title, difficulty):
    import re

    match = re.search(r"(\d+)\s*-?\s*(?:minute|min)\b", title, re.IGNORECASE)

    if match:
        return int(match.group(1))

    if difficulty == "Easy":
        return 25

    if difficulty == "Hard":
        return 60

    return 45


def derive_calories(meal_type, category):
    category_lower = category.lower()

    if meal_type == "Dessert" or category_lower == "dessert":
        return 350

    if meal_type == "Breakfast" or category_lower == "breakfast":
        return 400

    if category_lower in ("seafood", "vegetarian"):
        return 450

    return 550


def transform_recipe(meal):
    ingredients = extract_ingredients(meal)

    category = meal.get("strCategory") or "Miscellaneous"
    title = meal.get("strMeal") or "Unknown Recipe"
    instructions = meal.get("strInstructions") or ""
    meal_type = derive_meal_type(category, title)
    difficulty = derive_difficulty(ingredients, instructions)

    return {
        "externalId": meal.get("idMeal"),

        "title": title,

        "description": (
            f"{title} - a {category.lower()} recipe "
            f"from {meal.get('strArea') or 'international'} cuisine."
        ),

        "imageUrl": meal.get("strMealThumb"),

        "instructions": instructions.strip(),

        "cuisine": meal.get("strArea") or "International",

        "category": category,

        "mealType": meal_type,

        "diet": derive_diet(
            category,
            title,
            ingredients
        ),

        "difficulty": difficulty,

        "cookTimeMinutes": derive_cook_time_minutes(title, difficulty),

        "calories": derive_calories(meal_type, category),

        "ingredients": ingredients,

        "tags": clean_tags(
            meal.get("strTags")
        ),

        "youtubeUrl": meal.get("strYoutube"),

        "source": "TheMealDB",

        "isAiGenerated": False
    }


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

def main():

    recipes = OrderedDict()

    print("\n🍳 ChefMate AI Recipe Importer")
    print("-----------------------------------")

    for category, limit in CATEGORY_LIMITS.items():

        print(f"\nFetching category: {category}")

        try:
            meals = get_category_meals(category)

        except Exception as error:
            print(f"❌ Failed: {error}")
            continue

        count = 0

        for meal in meals:

            if len(recipes) >= 50:
                break

            meal_id = meal.get("idMeal")

            if not meal_id:
                continue

            if meal_id in recipes:
                continue

            try:
                print(
                    f"  → Fetching {meal.get('strMeal')}"
                )

                full_recipe = get_recipe_details(meal_id)

                if not full_recipe:
                    continue

                recipe = transform_recipe(full_recipe)

                recipes[meal_id] = recipe

                count += 1

                # Small delay so we're polite to the API.
                time.sleep(0.15)

                if count >= limit:
                    break

            except Exception as error:
                print(
                    f"  ⚠️ Skipping {meal_id}: {error}"
                )

        print(
            f"  ✓ Added {count} recipes"
        )

        if len(recipes) >= 50:
            break

    # -----------------------------------------------------
    # Save exactly 50 recipes
    # -----------------------------------------------------

    final_recipes = list(recipes.values())[:50]

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            final_recipes,
            file,
            indent=2,
            ensure_ascii=False
        )

    print("\n-----------------------------------")
    print(
        f"✅ DONE! Created {len(final_recipes)} recipes."
    )
    print(
        f"📄 File: {OUTPUT_FILE}"
    )

    # -----------------------------------------------------
    # Print summary
    # -----------------------------------------------------

    print("\nRecipe distribution:")

    category_counts = {}

    for recipe in final_recipes:

        category = recipe["category"]

        category_counts[category] = (
            category_counts.get(category, 0) + 1
        )

    for category, count in category_counts.items():

        print(
            f"  {category}: {count}"
        )

    print("\n🎉 ChefMate recipe dataset ready!")


if __name__ == "__main__":
    main()
