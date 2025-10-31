
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { SavedMeal, MealCategory } from '../types';
import { PlusIcon, StarIcon, TrashIcon, EditIcon, SparklesIcon } from '../components/icons';
import Modal from '../components/Modal';
import { editImageWithGemini } from '../services/geminiService';
import SmallMacroChart from '../components/SmallMacroChart';

const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        const [meta, data] = result.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        resolve({ base64: data, mimeType: mimeType });
    };
    reader.onerror = (error) => reject(error);
  });

const MealForm: React.FC<{
    meal: SavedMeal | null;
    onSave: (meal: SavedMeal) => void;
    onClose: () => void;
}> = ({ meal, onSave, onClose }) => {
    const [formState, setFormState] = useState<Omit<SavedMeal, 'id' | 'createdAt'>>({
        name: meal?.name || '',
        category: meal?.category || MealCategory.Lunch,
        calories: meal?.calories || 0,
        protein_g: meal?.protein_g || 0,
        carbs_g: meal?.carbs_g || 0,
        fats_g: meal?.fats_g || 0,
        imageUrl: meal?.imageUrl,
        favorite: meal?.favorite || false,
        defaultServing: meal?.defaultServing || 100,
    });
    const [imageFile, setImageFile] = useState<{file: File, base64: string, mimeType: string} | null>(null);
    const [geminiPrompt, setGeminiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormState(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const { base64, mimeType } = await fileToBase64(file);
            setFormState(prev => ({...prev, imageUrl: `data:${mimeType};base64,${base64}`}));
            setImageFile({ file, base64, mimeType });
        }
    };
    
    const handleGeminiEdit = async () => {
        if (!imageFile || !geminiPrompt) {
            alert("Please select an image and enter a prompt for the AI.");
            return;
        }
        setIsGenerating(true);
        try {
            const newBase64 = await editImageWithGemini(imageFile.base64, imageFile.mimeType, geminiPrompt);
            const newImageUrl = `data:${imageFile.mimeType};base64,${newBase64}`;
            setFormState(prev => ({ ...prev, imageUrl: newImageUrl }));
            setImageFile(prev => prev ? ({ ...prev, base64: newBase64 }) : null);
        } catch (error) {
            console.error(error);
            alert("Failed to edit image with AI. See console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const savedMeal: SavedMeal = {
            id: meal?.id || `sm-${Date.now()}`,
            createdAt: meal?.createdAt || Date.now(),
            ...formState
        };
        onSave(savedMeal);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Meal Name" value={formState.name} onChange={handleChange} className="w-full p-2 border rounded" required />
            <select name="category" value={formState.category} onChange={handleChange} className="w-full p-2 border rounded">
                {Object.values(MealCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
             <div className="grid grid-cols-2 gap-4">
                <input type="number" name="calories" placeholder="Calories" value={formState.calories} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="defaultServing" placeholder="Serving Size (g)" value={formState.defaultServing} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="protein_g" placeholder="Protein (g)" value={formState.protein_g} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="number" name="carbs_g" placeholder="Carbs (g)" value={formState.carbs_g} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="number" name="fats_g" placeholder="Fats (g)" value={formState.fats_g} onChange={handleChange} className="w-full p-2 border rounded" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Meal Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                {formState.imageUrl && <img src={formState.imageUrl} alt="Meal preview" className="mt-2 rounded-lg max-h-40 w-auto mx-auto"/>}
             </div>
             <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                 <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <SparklesIcon className="w-5 h-5" />
                    <span>Edit with AI</span>
                 </div>
                <input type="text" placeholder="e.g., 'add a sprig of parsley on top'" value={geminiPrompt} onChange={e => setGeminiPrompt(e.target.value)} className="w-full p-2 border rounded" disabled={!imageFile}/>
                <button type="button" onClick={handleGeminiEdit} disabled={!imageFile || isGenerating || !geminiPrompt} className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isGenerating ? 'Generating...' : 'Generate New Image'}
                </button>
             </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Save Meal</button>
        </form>
    );
};


const SavedMealsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<SavedMeal | null>(null);

    if (!context) {
        return <div className="p-4">Loading application data...</div>;
    }
    const { savedMeals, setSavedMeals } = context;

    const handleAddNew = () => {
        setEditingMeal(null);
        setModalOpen(true);
    };

    const handleEdit = (meal: SavedMeal) => {
        setEditingMeal(meal);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            setSavedMeals(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleToggleFavorite = (id: string) => {
        setSavedMeals(prev => prev.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
    };

    const handleSaveMeal = (meal: SavedMeal) => {
        if (editingMeal) {
            setSavedMeals(prev => prev.map(m => m.id === meal.id ? meal : m));
        } else {
            setSavedMeals(prev => [meal, ...prev]);
        }
        setModalOpen(false);
    };

    return (
        <div className="p-4 space-y-6">
            <header className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold">My Meals</h1>
                    <p className="text-gray-500">Your saved custom meals.</p>
                </div>
                <button onClick={handleAddNew} className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </header>
            
            {savedMeals.length === 0 ? (
                 <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">You haven't saved any meals yet.</p>
                    <button onClick={handleAddNew} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg">Add Your First Meal</button>
                </div>
            ) : (
                <div className="space-y-3">
                    {savedMeals.sort((a,b) => b.createdAt - a.createdAt).map(meal => (
                        <div key={meal.id} className="bg-white p-3 rounded-lg shadow flex items-start gap-4">
                            {meal.imageUrl && <img src={meal.imageUrl} alt={meal.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />}
                            <div className="flex-grow">
                                <p className="font-bold">{meal.name}</p>
                                <p className="text-sm text-gray-600">{meal.calories} kcal / {meal.defaultServing}g</p>
                                <div className="mt-2">
                                    <SmallMacroChart protein={meal.protein_g} carbs={meal.carbs_g} fats={meal.fats_g} />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button onClick={() => handleToggleFavorite(meal.id)} className={`p-1 rounded-full ${meal.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}`}>
                                    <StarIcon className="w-6 h-6" filled={meal.favorite} />
                                </button>
                                <button onClick={() => handleEdit(meal)} className="text-gray-500 hover:text-blue-600 p-1">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(meal.id)} className="text-gray-500 hover:text-red-600 p-1">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingMeal ? 'Edit Meal' : 'Add New Meal'}>
                <MealForm meal={editingMeal} onSave={handleSaveMeal} onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default SavedMealsPage;
