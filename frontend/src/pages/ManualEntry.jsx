import React, { useState } from 'react';
import { Edit, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManualEntry = () => {
  const [formData, setFormData] = useState({
    calories: '',
    protein: '',
    fats: '',
    carbohydrates: '',
    sugar: '',
    sodium: '',
    saturated_fat: '',
    trans_fat: '',
    cholesterol: '',
    ingredients: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Format data for API
      const nutritionData = {
        calories: formData.calories,
        protein: formData.protein,
        fats: formData.fats,
        carbohydrates: formData.carbohydrates,
        sugar: formData.sugar,
        sodium: formData.sodium,
        saturated_fat: formData.saturated_fat,
        trans_fat: formData.trans_fat,
        cholesterol: formData.cholesterol
      };

      const response = await fetch('http://localhost:8000/manual-entry/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          ingredients_text: formData.ingredients,
          nutrition_data: nutritionData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process data');
      }

      // Navigate to results page with the analysis data
      navigate('/result', { state: { analysisData: data } });

    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to analyze data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] 
        flex flex-col items-center justify-center z-50">
        <div className="w-24 h-24 rounded-full border-4 border-[#FF4081] 
          border-t-transparent animate-spin mb-8" />
        <div className="text-2xl font-semibold text-[#FF4081] mb-2">
          Processing Data
        </div>
        <div className="text-gray-600 text-center max-w-sm px-4">
          Please wait while we analyze your nutrition information. This might take a few moments.
        </div>
        <div className="mt-8 flex flex-col items-center space-y-2">
          <div className="h-1 w-48 bg-pink-100 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-[#FF4081] rounded-full 
              animate-[progressBar_1.5s_ease-in-out_infinite]" />
          </div>
          <div className="text-sm text-gray-500">Analyzing nutritional data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] pt-32 pb-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text 
            mb-4 tracking-tight">
            Manual Nutrition Entry
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter nutrition facts manually for precise analysis
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl p-8 border border-pink-100"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nutrition Facts Inputs */}
            {[
              { label: 'Calories', name: 'calories', placeholder: 'Total calories' },
              { label: 'Protein', name: 'protein', placeholder: 'in grams' },
              { label: 'Fats', name: 'fats', placeholder: 'in grams' },
              { label: 'Carbohydrates', name: 'carbohydrates', placeholder: 'in grams' },
              { label: 'Sugar', name: 'sugar', placeholder: 'in grams' },
              { label: 'Sodium', name: 'sodium', placeholder: 'in mg' },
              { label: 'Saturated Fat', name: 'saturated_fat', placeholder: 'in grams' },
              { label: 'Trans Fat', name: 'trans_fat', placeholder: 'in grams' },
              { label: 'Cholesterol', name: 'cholesterol', placeholder: 'in mg' }
            ].map((field) => (
              <div key={field.name}>
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border border-pink-200 
                  rounded-lg focus:ring-2 focus:ring-[#FF4081] 
                  focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>

          {/* Ingredients Textarea */}
          <div className="mt-6">
            <label 
              htmlFor="ingredients" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              placeholder="List all ingredients..."
              rows={4}
              className="w-full px-4 py-2 border border-pink-200 
              rounded-lg focus:ring-2 focus:ring-[#FF4081] 
              focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="flex items-center gap-2 mx-auto
              bg-gradient-to-r from-[#FF4081] to-[#F50057]
              text-white font-semibold py-3 px-8 
              rounded-full transition-all 
              hover:scale-105 hover:shadow-xl"
            >
              <CheckCircle className="w-5 h-5"/>
              Analyze Nutrition
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-pink-50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Manual Entry Tips
            </h3>
            <ul className="space-y-2 text-gray-600 max-w-xl mx-auto">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500"/>
                Use exact values from the nutrition label
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500"/>
                Include serving size for accurate analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500"/>
                List ingredients in order of quantity
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualEntry;