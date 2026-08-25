export type PlaceholderRecipe = {
  id: string
  title: string
  cuisine: string
  cookTime: string
  imageUrl: string
  imageAlt: string
}

export const placeholderRecipes: PlaceholderRecipe[] = [
  {
    id: '1',
    title: 'Tomato basil linguine',
    cuisine: 'Italian',
    cookTime: '25 min',
    imageUrl:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Bowl of tomato pasta with basil',
  },
  {
    id: '2',
    title: 'Coconut red curry',
    cuisine: 'Thai',
    cookTime: '35 min',
    imageUrl:
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Thai curry in a bowl',
  },
  {
    id: '3',
    title: 'Butter chicken',
    cuisine: 'Indian',
    cookTime: '45 min',
    imageUrl:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Butter chicken with naan',
  },
  {
    id: '4',
    title: 'Miso ramen',
    cuisine: 'Japanese',
    cookTime: '40 min',
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Bowl of ramen with egg',
  },
  {
    id: '5',
    title: 'Shakshuka',
    cuisine: 'Mediterranean',
    cookTime: '30 min',
    imageUrl:
      'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Shakshuka in a skillet',
  },
  {
    id: '6',
    title: 'Citrus avocado toast',
    cuisine: 'American',
    cookTime: '15 min',
    imageUrl:
      'https://images.unsplash.com/photo-1541519227354-08bf27d12580?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Avocado toast on a plate',
  },
]
