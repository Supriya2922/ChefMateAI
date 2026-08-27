export const brand = {
  name: 'ChefMate AI',
  shortName: 'ChefMate',
  documentTitle: 'ChefMate AI',
  metaDescription:
    'ChefMate AI is your kitchen companion — plan meals from your pantry, discover recipes that fit your taste, and cook with a chef that knows your table.',
} as const

export const navItems = [
  { to: '/dashboard', label: 'Home' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/pantry', label: 'Pantry' },
  { to: '/ai', label: 'AI' },
  { to: '/cookbook', label: 'Cookbook' },
  { to: '/explore', label: 'Explore' },
] as const

export const loader = {
  hint: 'Warming up the kitchen…',
} as const

export const auth = {
  eyebrow: brand.name,
  headline: 'Your AI kitchen companion.',
  lede: 'Plan meals from your pantry, discover recipes that fit your taste, and cook with a chef that knows your table.',
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your ChefMate AI kitchen.',
    footerLead: 'New here?',
    footerLink: 'Create an account',
    submit: 'Sign in',
    submitting: 'Signing in…',
  },
  register: {
    title: 'Start cooking smarter',
    subtitle: 'Create your account, set your tastes, and unlock personalized recipes.',
    footerLead: 'Already have an account?',
    footerLink: 'Sign in',
    submit: 'Create account',
    submitting: 'Creating account…',
    passwordHint: 'At least 8 characters, with upper, lower, and a number.',
  },
} as const

export const dashboard = {
  lede: "Tonight's picks, shaped by your preferences, pantry, and mood. Full personalization arrives as we connect the rest of your kitchen.",
  recipesHeading: "Tonight's ideas",
  quickActions: [
    {
      to: '/ai',
      title: 'AI kitchen',
      description: 'Ask the chef, generate a recipe, or swap an ingredient on the fly.',
    },
    {
      to: '/pantry',
      title: 'My pantry',
      description: 'See what you have, track expiry, and cook from your shelf.',
    },
    {
      to: '/explore',
      title: 'Explore',
      description: 'Browse by cuisine, mood, trending dishes, or picks made just for you.',
    },
  ],
} as const

export const profilePage = {
  backLabel: '← Home',
  title: 'Your kitchen profile',
  lede: 'Diet, allergies, cuisines, skill, and household size — the signals ChefMate AI uses to tailor every suggestion.',
} as const

export const userMenu = {
  empty: 'Kitchen profile not set yet.',
  edit: 'Edit kitchen profile',
} as const

export type FeaturePreview = {
  title: string
  description: string
}

export type SectionCopy = {
  eyebrow: string
  title: string
  lede: string
  features: FeaturePreview[]
}

export const comingSoon = 'Coming soon'

export const recipesSection: SectionCopy = {
  eyebrow: 'Recipes',
  title: 'Recipe library',
  lede: 'Search, filter, and explore full nutrition details for every dish.',
  features: [
    {
      title: 'Browse',
      description: 'Scroll a curated library of dishes you can actually cook this week.',
    },
    {
      title: 'Search',
      description: 'Find a recipe by name, ingredient, or the craving you have right now.',
    },
    {
      title: 'Filters',
      description: 'Narrow by time, diet, cuisine, and skill so the list fits your kitchen.',
    },
    {
      title: 'Recipe details',
      description: 'Open a full cook-along view with steps, yields, and what you will need.',
    },
    {
      title: 'Nutrition',
      description: 'See macros and highlights so you can plan plates with more confidence.',
    },
  ],
}

export const pantrySection: SectionCopy = {
  eyebrow: 'Pantry',
  title: 'My pantry',
  lede: "Track what's on your shelf — quantities, expiry dates, and categories.",
  features: [
    {
      title: 'Add, edit, delete',
      description: 'Keep a living list of what you own, without a spreadsheet in the way.',
    },
    {
      title: 'Quantities',
      description: 'Note how much is left so recipes can stretch what you already bought.',
    },
    {
      title: 'Expiry',
      description: 'Spot what is close to going off and cook it before it leaves the fridge.',
    },
    {
      title: 'Categories',
      description: 'Group produce, dairy, spices, and staples so the shelf stays scannable.',
    },
  ],
}

export const pantryPage = {
  add: 'Add ingredient',
  edit: 'Edit ingredient',
  save: 'Save ingredient',
  saving: 'Saving…',
  cancel: 'Cancel',
  delete: 'Delete',
  confirmDelete: (name: string) => `Remove ${name} from your pantry?`,
  confirmDeleteAction: 'Remove',
  keep: 'Keep',
  searchLabel: 'Search pantry',
  searchPlaceholder: 'Search ingredients',
  categoryLabel: 'Category',
  allCategories: 'All categories',
  expiryFilterLabel: 'Expiry',
  filters: {
    all: 'All',
    expiring: 'Expiring',
    expired: 'Expired',
  },
  nameLabel: 'Ingredient name',
  quantityLabel: 'Quantity',
  unitLabel: 'Unit',
  expiryLabel: 'Expiry date',
  expiryOptional: 'Optional',
  categoryHint: 'Pick a category or type a new one.',
  emptyTitle: 'Your pantry is empty',
  emptyLede: 'Add what you have on the shelf — tomato, rice, paneer — and ChefMate can cook from it.',
  noMatches: 'No ingredients match these filters.',
  clearFilters: 'Clear filters',
  loading: 'Loading your pantry…',
  loadError: 'Could not load your pantry. Try again.',
  retry: 'Try again',
  summaryExpiring: (count: number) =>
    count === 1 ? '1 item expiring soon' : `${count} items expiring soon`,
  summaryExpired: (count: number) =>
    count === 1 ? '1 item expired' : `${count} items expired`,
  increaseQuantity: 'Increase quantity',
  decreaseQuantity: 'Decrease quantity',
} as const

export const aiSection: SectionCopy = {
  eyebrow: 'AI',
  title: 'AI kitchen',
  lede: 'Ask your chef, generate recipes, scan your pantry, or swap ingredients on the fly.',
  features: [
    {
      title: 'AI Chef',
      description: 'Talk through dinner, constraints, and leftovers with a chef that knows you.',
    },
    {
      title: 'Recipe generator',
      description: 'Turn a craving, a time box, or a handful of ingredients into a full recipe.',
    },
    {
      title: 'Pantry scanner',
      description: 'Capture what is in the fridge and let ChefMate AI put it on the shelf.',
    },
    {
      title: 'Ingredient substitution',
      description: 'Swap what you are missing without losing the spirit of the dish.',
    },
  ],
}

export const cookbookSection: SectionCopy = {
  eyebrow: 'Cookbook',
  title: 'Your cookbook',
  lede: 'Save favorites and organize recipes into collections.',
  features: [
    {
      title: 'Favorites',
      description: 'Pin the dishes you return to, from weeknight pasta to weekend projects.',
    },
    {
      title: 'Collections',
      description: 'Group recipes by mood, occasion, or the people you cook for.',
    },
  ],
}

export const exploreSection: SectionCopy = {
  eyebrow: 'Explore',
  title: 'Explore',
  lede: 'Browse by cuisine, mood, trending dishes, or picks made just for you.',
  features: [
    {
      title: 'Cuisine',
      description: 'Wander by region and flavor — from the kitchens you love to ones to try.',
    },
    {
      title: 'Mood',
      description: 'Match dinner to the night: comfort, bright, quick, or something celebratory.',
    },
    {
      title: 'Trending',
      description: 'See what other home cooks are making right now.',
    },
    {
      title: 'Personalized',
      description: 'A feed shaped by your profile, pantry, and the way you like to cook.',
    },
  ],
}
