import React from 'react';

interface MacrosChartProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
}

const MacrosChart: React.FC<MacrosChartProps> = ({
  calories, protein, carbs, fats,
  calorieGoal, proteinGoal, carbsGoal, fatsGoal
}) => {
  const caloriesRemaining = calorieGoal - calories;
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col items-center mb-4">
        <h3 className="text-2xl font-bold">{Math.round(calories)}</h3>
        <p className="text-gray-500">Calories Eaten</p>
        <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
            <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${calorieGoal > 0 ? Math.min((calories / calorieGoal) * 100, 100) : 0}%` }}
            ></div>
        </div>
        <p className="mt-1 text-sm text-gray-500">{caloriesRemaining >= 0 ? `${Math.round(caloriesRemaining)} calories remaining` : `${Math.abs(Math.round(caloriesRemaining))} calories over`}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-bold">{Math.round(protein)}g</p>
          <p className="text-sm text-gray-500">Protein</p>
           <div className="w-full h-1 mt-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-green-500 rounded-full" style={{ width: `${proteinGoal > 0 ? Math.min((protein / proteinGoal) * 100, 100) : 0}%` }}></div>
          </div>
        </div>
         <div>
          <p className="font-bold">{Math.round(carbs)}g</p>
          <p className="text-sm text-gray-500">Carbs</p>
          <div className="w-full h-1 mt-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-yellow-500 rounded-full" style={{ width: `${carbsGoal > 0 ? Math.min((carbs / carbsGoal) * 100, 100) : 0}%` }}></div>
          </div>
        </div>
         <div>
          <p className="font-bold">{Math.round(fats)}g</p>
          <p className="text-sm text-gray-500">Fats</p>
          <div className="w-full h-1 mt-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-red-500 rounded-full" style={{ width: `${fatsGoal > 0 ? Math.min((fats / fatsGoal) * 100, 100) : 0}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacrosChart;
