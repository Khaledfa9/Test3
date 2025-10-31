
import React, { createContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SavedMeal, DayLog, UserSettings, LoggedMeal, MealCategory } from '../types';
import { INITIAL_SAVED_MEALS, INITIAL_SETTINGS, INITIAL_TODAYS_MEALS, INITIAL_DAY_LOGS } from '../constants';

interface IAppContext {
    settings: UserSettings;
    setSettings: (settings: UserSettings) => void;
    savedMeals: SavedMeal[];
    setSavedMeals: (meals: SavedMeal[] | ((meals: SavedMeal[]) => SavedMeal[])) => void;
    todaysMeals: LoggedMeal[];
    setTodaysMeals: (meals: LoggedMeal[] | ((meals: LoggedMeal[]) => LoggedMeal[])) => void;
    dayLogs: DayLog[];
    setDayLogs: (logs: DayLog[] | ((logs: DayLog[]) => DayLog[])) => void;
    addMealToToday: (meal: SavedMeal, serving: number) => void;
    addQuickMealToToday: (meal: Omit<LoggedMeal, 'id'>) => void;
    removeMealFromToday: (logId: string) => void;
    resetDay: (date: Date) => void;
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    }
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useLocalStorage<UserSettings>('settings', INITIAL_SETTINGS);
    const [savedMeals, setSavedMeals] = useLocalStorage<SavedMeal[]>('savedMeals', INITIAL_SAVED_MEALS);
    const [todaysMeals, setTodaysMeals] = useLocalStorage<LoggedMeal[]>('todaysMeals', INITIAL_TODAYS_MEALS);
    const [dayLogs, setDayLogs] = useLocalStorage<DayLog[]>('dayLogs', INITIAL_DAY_LOGS);

    const totals = useMemo(() => {
        return todaysMeals.reduce(
            (acc, meal) => {
                acc.calories += meal.calories;
                acc.protein += meal.protein_g;
                acc.carbs += meal.carbs_g;
                acc.fats += meal.fats_g;
                return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
    }, [todaysMeals]);

    const addMealToToday = (meal: SavedMeal, serving: number) => {
        const servingRatio = serving / meal.defaultServing;
        const newMealLog: LoggedMeal = {
            id: `lm-${Date.now()}`,
            mealId: meal.id,
            customName: meal.name,
            category: meal.category,
            calories: Math.round(meal.calories * servingRatio),
            protein_g: Math.round(meal.protein_g * servingRatio),
            carbs_g: Math.round(meal.carbs_g * servingRatio),
            fats_g: Math.round(meal.fats_g * servingRatio),
            serving: serving,
        };
        setTodaysMeals(prev => [...prev, newMealLog]);
    };
    
    const addQuickMealToToday = (meal: Omit<LoggedMeal, 'id'>) => {
        const newMealLog: LoggedMeal = {
            id: `lm-${Date.now()}`,
            ...meal
        };
        setTodaysMeals(prev => [...prev, newMealLog]);
    };

    const removeMealFromToday = (logId: string) => {
        setTodaysMeals(prev => prev.filter(meal => meal.id !== logId));
    };
    
    const resetDay = (date: Date) => {
        if (todaysMeals.length === 0) {
            // Don't save an empty log
            return;
        }
        const newLog: DayLog = {
            date: date.toISOString().split('T')[0],
            meals: todaysMeals,
            totalCalories: totals.calories,
            totalProtein: totals.protein,
            totalCarbs: totals.carbs,
            totalFats: totals.fats,
            createdAt: Date.now()
        };
        setDayLogs(prev => [newLog, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setTodaysMeals([]);
    };

    const value = {
        settings,
        setSettings,
        savedMeals,
        setSavedMeals,
        todaysMeals,
        setTodaysMeals,
        dayLogs,
        setDayLogs,
        addMealToToday,
        addQuickMealToToday,
        removeMealFromToday,
        resetDay,
        totals
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
