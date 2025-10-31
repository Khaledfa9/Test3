import React from 'react';

interface SmallMacroChartProps {
    protein: number;
    carbs: number;
    fats: number;
}

const SmallMacroChart: React.FC<SmallMacroChartProps> = ({ protein, carbs, fats }) => {
    const total = protein + carbs + fats;
    if (total === 0) {
        return <div className="text-xs text-gray-500">No macro data.</div>;
    }

    const proteinPercent = (protein / total) * 100;
    const carbsPercent = (carbs / total) * 100;
    const fatsPercent = (fats / total) * 100;

    return (
        <div>
            <div className="flex w-full h-2 overflow-hidden rounded-full">
                <div style={{ width: `${proteinPercent}%` }} className="bg-green-500"></div>
                <div style={{ width: `${carbsPercent}%` }} className="bg-yellow-500"></div>
                <div style={{ width: `${fatsPercent}%` }} className="bg-red-500"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>P: {Math.round(protein)}g</span>
                <span>C: {Math.round(carbs)}g</span>
                <span>F: {Math.round(fats)}g</span>
            </div>
        </div>
    );
};

export default SmallMacroChart;
