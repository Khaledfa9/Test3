
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { UserSettings } from '../types';

const SettingsPage: React.FC = () => {
    const context = useContext(AppContext);
    
    if (!context) {
        return <div className="p-4">Loading application data...</div>;
    }
    
    const { settings, setSettings } = context;
    const [formState, setFormState] = useState<UserSettings>(settings);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormState(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: Number(value) >= 0 ? Number(value) : 0 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSettings(formState);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };
    
    const InputField: React.FC<{label: string, name: keyof UserSettings, value: number, unit: string}> = ({label, name, value, unit}) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <input 
                    type="number" 
                    name={name} 
                    id={name} 
                    value={value} 
                    onChange={handleChange} 
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md" 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{unit}</span>
                </div>
            </div>
        </div>
    );


    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-500">Manage your goals and preferences.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                <h2 className="text-xl font-semibold border-b pb-3 text-gray-800">Daily Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Calorie Goal" name="dailyCalorieGoal" value={formState.dailyCalorieGoal} unit="kcal" />
                   <InputField label="Protein Goal" name="dailyProteinGoal" value={formState.dailyProteinGoal} unit="g" />
                   <InputField label="Carbs Goal" name="dailyCarbsGoal" value={formState.dailyCarbsGoal} unit="g" />
                   <InputField label="Fats Goal" name="dailyFatsGoal" value={formState.dailyFatsGoal} unit="g" />
                </div>
                <div className="flex justify-end items-center gap-4 pt-4">
                    {isSaved && <span className="text-green-600 text-sm transition-opacity duration-300">Settings saved successfully!</span>}
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
