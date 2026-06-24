import type { FoodResult } from '@/stores/foodSearch'

// Curated Filipino whole-food list with USDA-accurate nutrition per 100g.
// These are unpackaged/unprocessed foods not found in OpenFoodFacts.
// IDs use 'local-' prefix so they never collide with real OFF product codes.
// First 6 items are the "Frequently Logged" default in the search view.
export const WHOLE_FOODS: FoodResult[] = [
  // --- Most commonly logged (first 6 = Frequently Logged section) ---
  {
    off_product_id: 'local-egg-raw',
    food_name: 'Egg, whole, raw',
    serving_size_g: 50,
    nutrients_per_100g: { calories: 143, protein_g: 13, carbs_g: 1.1, fat_g: 10, fiber_g: 0, sugar_g: 0.4, sodium_mg: 142 },
  },
  {
    off_product_id: 'local-white-rice-cooked',
    food_name: 'White Rice, cooked',
    serving_size_g: 186,
    nutrients_per_100g: { calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3, fiber_g: 0.4, sugar_g: 0, sodium_mg: 1 },
  },
  {
    off_product_id: 'local-chicken-breast-raw',
    food_name: 'Chicken Breast, raw',
    serving_size_g: 150,
    nutrients_per_100g: { calories: 120, protein_g: 22.5, carbs_g: 0, fat_g: 2.6, sodium_mg: 74 },
  },
  {
    off_product_id: 'local-banana',
    food_name: 'Banana',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3, fiber_g: 2.6, sugar_g: 12, sodium_mg: 1 },
  },
  {
    off_product_id: 'local-tilapia-raw',
    food_name: 'Tilapia, raw',
    serving_size_g: 150,
    nutrients_per_100g: { calories: 96, protein_g: 20, carbs_g: 0, fat_g: 1.7, sodium_mg: 52 },
  },
  {
    off_product_id: 'local-pork-belly-raw',
    food_name: 'Pork Belly, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 518, protein_g: 9.3, carbs_g: 0, fat_g: 53, sodium_mg: 38 },
  },

  // --- More proteins ---
  {
    off_product_id: 'local-egg-white-raw',
    food_name: 'Egg White, raw',
    serving_size_g: 30,
    nutrients_per_100g: { calories: 52, protein_g: 10.9, carbs_g: 0.7, fat_g: 0.2, sodium_mg: 166 },
  },
  {
    off_product_id: 'local-chicken-breast-boiled',
    food_name: 'Chicken Breast, cooked (boiled)',
    serving_size_g: 150,
    nutrients_per_100g: { calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, sodium_mg: 74 },
  },
  {
    off_product_id: 'local-chicken-thigh-raw',
    food_name: 'Chicken Thigh, raw',
    serving_size_g: 120,
    nutrients_per_100g: { calories: 177, protein_g: 17, carbs_g: 0, fat_g: 11.7, sodium_mg: 70 },
  },
  {
    off_product_id: 'local-ground-pork',
    food_name: 'Ground Pork',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 263, protein_g: 17, carbs_g: 0, fat_g: 21, sodium_mg: 62 },
  },
  {
    off_product_id: 'local-beef-sirloin-raw',
    food_name: 'Beef Sirloin, raw',
    serving_size_g: 150,
    nutrients_per_100g: { calories: 207, protein_g: 21, carbs_g: 0, fat_g: 13, sodium_mg: 59 },
  },
  {
    off_product_id: 'local-bangus-raw',
    food_name: 'Bangus (Milkfish), raw',
    serving_size_g: 150,
    nutrients_per_100g: { calories: 148, protein_g: 21, carbs_g: 0, fat_g: 6.8, sodium_mg: 78 },
  },
  {
    off_product_id: 'local-galunggong-raw',
    food_name: 'Galunggong (Round Scad), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 130, protein_g: 21, carbs_g: 0, fat_g: 5, sodium_mg: 65 },
  },
  {
    off_product_id: 'local-shrimp-raw',
    food_name: 'Shrimp, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 85, protein_g: 20, carbs_g: 0, fat_g: 0.9, sodium_mg: 119 },
  },
  {
    off_product_id: 'local-tofu-firm',
    food_name: 'Tofu, firm',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 76, protein_g: 8, carbs_g: 1.9, fat_g: 4.8, sodium_mg: 7 },
  },
  {
    off_product_id: 'local-sardines-tomato',
    food_name: 'Sardines in Tomato Sauce (canned)',
    brand_name: 'Generic',
    serving_size_g: 90,
    nutrients_per_100g: { calories: 150, protein_g: 15, carbs_g: 5, fat_g: 8, sodium_mg: 400 },
  },
  {
    off_product_id: 'local-corned-beef',
    food_name: 'Corned Beef (canned)',
    brand_name: 'Generic',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 210, protein_g: 15, carbs_g: 0, fat_g: 16, sodium_mg: 900 },
  },

  // --- Grains & carbs ---
  {
    off_product_id: 'local-white-rice-raw',
    food_name: 'White Rice, raw',
    serving_size_g: 45,
    nutrients_per_100g: { calories: 365, protein_g: 7, carbs_g: 80, fat_g: 0.7, fiber_g: 1.3, sodium_mg: 1 },
  },
  {
    off_product_id: 'local-brown-rice-cooked',
    food_name: 'Brown Rice, cooked',
    serving_size_g: 195,
    nutrients_per_100g: { calories: 123, protein_g: 2.7, carbs_g: 25.6, fat_g: 1, fiber_g: 1.8, sodium_mg: 1 },
  },
  {
    off_product_id: 'local-pandesal',
    food_name: 'Pandesal',
    serving_size_g: 50,
    nutrients_per_100g: { calories: 280, protein_g: 8, carbs_g: 52, fat_g: 4, fiber_g: 1.5, sodium_mg: 380 },
  },
  {
    off_product_id: 'local-white-bread',
    food_name: 'White Bread',
    serving_size_g: 30,
    nutrients_per_100g: { calories: 265, protein_g: 9, carbs_g: 49, fat_g: 3.2, fiber_g: 2.7, sodium_mg: 477 },
  },

  // --- Vegetables ---
  {
    off_product_id: 'local-sitaw',
    food_name: 'String Beans (Sitaw), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 35, protein_g: 2, carbs_g: 7.9, fat_g: 0.1, fiber_g: 3.4, sodium_mg: 6 },
  },
  {
    off_product_id: 'local-kangkong',
    food_name: 'Kangkong (Water Spinach), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 19, protein_g: 2.6, carbs_g: 3.1, fat_g: 0.2, fiber_g: 2.1, sodium_mg: 113 },
  },
  {
    off_product_id: 'local-malunggay',
    food_name: 'Malunggay (Moringa leaves)',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 64, protein_g: 9.4, carbs_g: 8.3, fat_g: 1.4, fiber_g: 2, sodium_mg: 9 },
  },
  {
    off_product_id: 'local-ampalaya',
    food_name: 'Ampalaya (Bitter Melon), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 17, protein_g: 1, carbs_g: 3.7, fat_g: 0.2, fiber_g: 2.8, sodium_mg: 5 },
  },
  {
    off_product_id: 'local-okra',
    food_name: 'Okra, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 33, protein_g: 1.9, carbs_g: 7.5, fat_g: 0.2, fiber_g: 3.2, sodium_mg: 7 },
  },
  {
    off_product_id: 'local-pechay',
    food_name: 'Pechay (Bok Choy), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 13, protein_g: 1.5, carbs_g: 2.2, fat_g: 0.2, fiber_g: 1, sodium_mg: 65 },
  },
  {
    off_product_id: 'local-talong',
    food_name: 'Eggplant (Talong), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 25, protein_g: 1, carbs_g: 5.9, fat_g: 0.2, fiber_g: 3, sodium_mg: 2 },
  },
  {
    off_product_id: 'local-carrots',
    food_name: 'Carrots, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 41, protein_g: 0.9, carbs_g: 9.6, fat_g: 0.2, fiber_g: 2.8, sugar_g: 4.7, sodium_mg: 69 },
  },
  {
    off_product_id: 'local-tomato',
    food_name: 'Tomato, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 18, protein_g: 0.9, carbs_g: 3.9, fat_g: 0.2, fiber_g: 1.2, sugar_g: 2.6, sodium_mg: 5 },
  },
  {
    off_product_id: 'local-onion',
    food_name: 'Onion, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 40, protein_g: 1.1, carbs_g: 9.3, fat_g: 0.1, fiber_g: 1.7, sugar_g: 4.2, sodium_mg: 4 },
  },
  {
    off_product_id: 'local-garlic',
    food_name: 'Garlic, raw',
    serving_size_g: 10,
    nutrients_per_100g: { calories: 149, protein_g: 6.4, carbs_g: 33, fat_g: 0.5, fiber_g: 2.1, sodium_mg: 17 },
  },
  {
    off_product_id: 'local-potato',
    food_name: 'Potato, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 77, protein_g: 2, carbs_g: 17.5, fat_g: 0.1, fiber_g: 2.2, sodium_mg: 6 },
  },
  {
    off_product_id: 'local-kamote',
    food_name: 'Sweet Potato (Kamote), raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 86, protein_g: 1.6, carbs_g: 20, fat_g: 0.1, fiber_g: 3, sugar_g: 4.2, sodium_mg: 55 },
  },
  {
    off_product_id: 'local-cabbage',
    food_name: 'Cabbage, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 25, protein_g: 1.3, carbs_g: 5.8, fat_g: 0.1, fiber_g: 2.5, sugar_g: 3.2, sodium_mg: 18 },
  },

  // --- Fruits ---
  {
    off_product_id: 'local-mango',
    food_name: 'Mango, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 60, protein_g: 0.8, carbs_g: 15, fat_g: 0.4, fiber_g: 1.6, sugar_g: 13.7, sodium_mg: 1 },
  },
  {
    off_product_id: 'local-papaya',
    food_name: 'Papaya, raw',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 43, protein_g: 0.5, carbs_g: 11, fat_g: 0.3, fiber_g: 1.7, sugar_g: 7.8, sodium_mg: 8 },
  },
  {
    off_product_id: 'local-watermelon',
    food_name: 'Watermelon',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 30, protein_g: 0.6, carbs_g: 7.6, fat_g: 0.2, fiber_g: 0.4, sugar_g: 6.2, sodium_mg: 1 },
  },
  {
    off_product_id: 'local-orange',
    food_name: 'Orange',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 47, protein_g: 0.9, carbs_g: 12, fat_g: 0.1, fiber_g: 2.4, sugar_g: 9.4, sodium_mg: 0 },
  },
  {
    off_product_id: 'local-apple',
    food_name: 'Apple',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2, fiber_g: 2.4, sugar_g: 10.4, sodium_mg: 1 },
  },

  // --- Dairy & fats ---
  {
    off_product_id: 'local-whole-milk',
    food_name: 'Whole Milk',
    serving_size_g: 240,
    nutrients_per_100g: { calories: 61, protein_g: 3.2, carbs_g: 4.8, fat_g: 3.3, sodium_mg: 43 },
  },
  {
    off_product_id: 'local-evap-milk',
    food_name: 'Evaporated Milk',
    serving_size_g: 30,
    nutrients_per_100g: { calories: 134, protein_g: 6.8, carbs_g: 10, fat_g: 7.6, sodium_mg: 106 },
  },
  {
    off_product_id: 'local-butter',
    food_name: 'Butter',
    serving_size_g: 14,
    nutrients_per_100g: { calories: 717, protein_g: 0.9, carbs_g: 0.1, fat_g: 81, sodium_mg: 643 },
  },
  {
    off_product_id: 'local-coconut-oil',
    food_name: 'Coconut Oil',
    serving_size_g: 14,
    nutrients_per_100g: { calories: 892, protein_g: 0, carbs_g: 0, fat_g: 99.1, sodium_mg: 0 },
  },
  {
    off_product_id: 'local-canola-oil',
    food_name: 'Cooking Oil (Canola)',
    serving_size_g: 14,
    nutrients_per_100g: { calories: 884, protein_g: 0, carbs_g: 0, fat_g: 100, sodium_mg: 0 },
  },

  // --- Legumes & nuts ---
  {
    off_product_id: 'local-monggo-cooked',
    food_name: 'Mung Beans (Monggo), cooked',
    serving_size_g: 100,
    nutrients_per_100g: { calories: 105, protein_g: 7.1, carbs_g: 19, fat_g: 0.4, fiber_g: 7.6, sodium_mg: 2 },
  },
  {
    off_product_id: 'local-peanuts-roasted',
    food_name: 'Peanuts, roasted',
    serving_size_g: 30,
    nutrients_per_100g: { calories: 585, protein_g: 25, carbs_g: 16, fat_g: 49, fiber_g: 8.5, sodium_mg: 7 },
  },
]
