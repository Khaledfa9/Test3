import { SavedMeal, UserSettings, MealCategory, LoggedMeal, DayLog } from './types';

export const INITIAL_SETTINGS: UserSettings = {
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 150,
    dailyCarbsGoal: 200,
    dailyFatsGoal: 65,
    preferredUnit: 'g',
};

export const INITIAL_SAVED_MEALS: SavedMeal[] = [
    {
        id: 'sm1',
        name: 'Tuna Salad',
        category: MealCategory.Lunch,
        calories: 250,
        protein_g: 20,
        carbs_g: 5,
        fats_g: 15,
        favorite: true,
        defaultServing: 100,
        createdAt: Date.now(),
        imageUrl: `https://picsum.photos/seed/tunasalad/400/300`,
    },
    {
        id: 'sm2',
        name: 'Oatmeal with Banana',
        category: MealCategory.Breakfast,
        calories: 320,
        protein_g: 12,
        carbs_g: 60,
        fats_g: 8,
        favorite: false,
        defaultServing: 1,
        createdAt: Date.now() - 100000,
        imageUrl: `https://picsum.photos/seed/oatmeal/400/300`,
    },
];

export const INITIAL_TODAYS_MEALS: LoggedMeal[] = [
    {
        id: 'lm1',
        mealId: 'sm2',
        customName: 'Oatmeal with Banana',
        category: MealCategory.Breakfast,
        calories: 320,
        protein_g: 12,
        carbs_g: 60,
        fats_g: 8,
        serving: 1,
    }
];

export const INITIAL_DAY_LOGS: DayLog[] = [];