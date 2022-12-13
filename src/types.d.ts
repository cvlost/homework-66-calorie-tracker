const meals = [
  'Breakfast',
  'Snack',
  'Lunch',
  'Dinner'
] as const;

export interface Meal {
  description: string;
  kcal: number;
  time: typeof meals[number];
  date: number;
}

export interface MealMutation extends Meal {
  kcal: string;
  time: typeof meals[number] | '';
}

export interface ApiMealList {
  [id: string]: Meal;
}

export interface MealWithId extends Meal {
  id: string;
}