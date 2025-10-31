
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import SmallMacroChart from '../components/SmallMacroChart';
import { DayLog, LoggedMeal } from '../types';

const HistoryPage: React.FC = () => {
    const context = useContext(AppContext);
    const [expandedLogDate, setExpandedLogDate] = useState<string | null>(null);

    if (!context) {
        return <div className="p-4">Loading application data...</div>;
    }
    const { dayLogs } = context;

    const toggleExpand = (date: string) => {
        setExpandedLogDate(prev => (prev === date ? null : date));
    };

    const MealDetails: React.FC<{ meals: LoggedMeal[] }> = ({ meals }) => (
        <div className="mt-4 pt-4 border-t space-y-2">
            {meals.map(meal => (
                <div key={meal.id} className="flex justify-between text-sm">
                    <span>{meal.customName}</span>
                    <span className="text-gray-600">{meal.calories} kcal</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">History</h1>
                <p className="text-gray-500">Your past meal logs.</p>
            </header>

            {dayLogs.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No history yet. Complete a day to see it here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {dayLogs.map((log: DayLog) => (
                        <div key={log.date} className="bg-white p-4 rounded-lg shadow transition-all">
                            <div className="cursor-pointer" onClick={() => toggleExpand(log.date)}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg">{new Date(log.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="text-gray-600">{Math.round(log.totalCalories)} kcal</p>
                                    </div>
                                    <button className="text-gray-500">
                                        {/* Simple chevron icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${expandedLogDate === log.date ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <SmallMacroChart protein={log.totalProtein} carbs={log.totalCarbs} fats={log.totalFats} />
                                </div>
                            </div>
                            {expandedLogDate === log.date && <MealDetails meals={log.meals} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
