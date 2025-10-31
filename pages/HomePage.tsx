
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MacrosChart from '../components/MacrosChart';
import { LoggedMeal, MealCategory, SavedMeal } from '../types';
import { PlusIcon, TrashIcon } from '../components/icons';
import Modal from '../components/Modal';

const HomePage: React.FC = () => {
    const context = useContext(AppContext);
    const [isAddMealModalOpen, setAddMealModalOpen] = useState(false);
    const [isQuickAddModalOpen, setQuickAddModalOpen] = useState(false);

    if (!context) {
        return <div className="p-4">Loading application data...</div>;
    }

    const { settings, totals, todaysMeals, removeMealFromToday, savedMeals, addMealToToday, addQuickMealToToday, resetDay } = context;

    const handleEndDay = () => {
        if (window.confirm("Are you sure you want to end the day? This will log today's meals to your history and clear the current list.")) {
            resetDay(new Date());
            alert("Today's meals have been logged to your history.");
        }
    };

    const QuickAddForm: React.FC = () => {
        const [name, setName] = useState('');
        const [calories, setCalories] = useState('');
        const [protein, setProtein] = useState('');
        const [carbs, setCarbs] = useState('');
        const [fats, setFats] = useState('');
        const [category, setCategory] = useState<MealCategory>(MealCategory.Snack);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!name || !calories) {
                alert("Please enter at least a name and calories.");
                return;
            }
            const newMeal: Omit<LoggedMeal, 'id'> = {
                customName: name,
                calories: Number(calories) || 0,
                protein_g: Number(protein) || 0,
                carbs_g: Number(carbs) || 0,
                fats_g: Number(fats) || 0,
                serving: 1,
                category: category,
                mealId: undefined,
            };
            addQuickMealToToday(newMeal);
            setQuickAddModalOpen(false);
        };
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Meal Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                <select value={category} onChange={e => setCategory(e.target.value as MealCategory)} className="w-full p-2 border rounded">
                    {Object.values(MealCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="number" placeholder="Protein (g)" value={protein} onChange={e => setProtein(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Carbs (g)" value={carbs} onChange={e => setCarbs(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Fats (g)" value={fats} onChange={e => setFats(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Add Meal</button>
            </form>
        )
    }

    const AddFromSavedList: React.FC = () => {
        const [servings, setServings] = useState<{[key: string]: string}>({});

        const handleAdd = (meal: SavedMeal) => {
            const serving = Number(servings[meal.id]) || meal.defaultServing;
            addMealToToday(meal, serving);
            setAddMealModalOpen(false);
        }

        return (
            <div className="space-y-3">
                {savedMeals.length > 0 ? savedMeals.map(meal => (
                    <div key={meal.id} className="p-3 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <p className="font-semibold">{meal.name}</p>
                            <p className="text-sm text-gray-500">{meal.calories} kcal per {meal.defaultServing}{settings.preferredUnit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={servings[meal.id] ?? meal.defaultServing}
                                onChange={(e) => setServings(prev => ({...prev, [meal.id]: e.target.value}))}
                                className="w-20 p-1 border rounded"
                            />
                            <span className="text-sm text-gray-600">{settings.preferredUnit}</span>
                            <button onClick={() => handleAdd(meal)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Add</button>
                        </div>
                    </div>
                )) : <p className="text-gray-500 text-center">No saved meals yet. Go to the 'Meals' tab to add some.</p>}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Today</h1>
                <p className="text-gray-500">{new Date().toDateString()}</p>
            </header>

            <MacrosChart
                calories={totals.calories}
                protein={totals.protein}
                carbs={totals.carbs}
                fats={totals.fats}
                calorieGoal={settings.dailyCalorieGoal}
                proteinGoal={settings.dailyProteinGoal}
                carbsGoal={settings.dailyCarbsGoal}
                fatsGoal={settings.dailyFatsGoal}
            />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Today's Meals</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setAddMealModalOpen(true)} className="bg-blue-500 text-white px-3 py-2 rounded-full flex items-center gap-1 text-sm shadow hover:bg-blue-600">
                            <PlusIcon className="w-4 h-4" /> Add Saved
                        </button>
                         <button onClick={() => setQuickAddModalOpen(true)} className="bg-green-500 text-white px-3 py-2 rounded-full flex items-center gap-1 text-sm shadow hover:bg-green-600">
                            <PlusIcon className="w-4 h-4" /> Quick Add
                        </button>
                    </div>
                </div>
                {todaysMeals.length > 0 ? (
                    <div className="space-y-3">
                        {todaysMeals.map(meal => (
                            <div key={meal.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{meal.customName}</p>
                                    <p className="text-sm text-gray-500">{meal.calories} kcal &bull; {meal.category}</p>
                                </div>
                                <button onClick={() => removeMealFromToday(meal.id)} className="text-red-500 hover:text-red-700 p-1">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : <div className="text-center py-8 bg-white rounded-lg shadow"><p className="text-gray-500">No meals logged yet today.</p></div>}
            </div>
            
            {todaysMeals.length > 0 && (
                <button onClick={handleEndDay} className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 shadow-md">
                    End Day & Log Meals
                </button>
            )}

            <Modal isOpen={isAddMealModalOpen} onClose={() => setAddMealModalOpen(false)} title="Add Meal From Saved">
                <AddFromSavedList />
            </Modal>
            <Modal isOpen={isQuickAddModalOpen} onClose={() => setQuickAddModalOpen(false)} title="Quick Add Meal">
                <QuickAddForm />
            </Modal>
        </div>
    );
};

export default HomePage;
