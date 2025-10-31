export enum MealCategory {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snack = "Snack"
}

export interface SavedMeal {
  id: string;
  name: string;
  category: MealCategory;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  imageUrl?: string;
  favorite: boolean;
  defaultServing: number;
  createdAt: number;
}

export interface LoggedMeal {
    id: string; // unique id for this specific log entry
    mealId?: string; // id of the saved meal if it exists
    customName: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fats_g: number;
    serving: number;
    category: MealCategory;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  meals: LoggedMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  createdAt: number;
}

export interface UserSettings {
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatsGoal: number;
  preferredUnit: string;
}