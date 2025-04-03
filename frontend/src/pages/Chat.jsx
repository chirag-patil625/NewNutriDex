import React, { useState } from 'react'
import { FiUpload, FiType, FiImage } from 'react-icons/fi'
import ingredientsExample from '../assests/ingredients.png'
import nutritionExample from '../assests/nutritionfacts.jpg'

export default function Chat() {
  const [inputMethod, setInputMethod] = useState('upload') // 'upload' or 'text'
  const [ingredientsImage, setIngredientsImage] = useState(null)
  const [nutritionImage, setNutritionImage] = useState(null)
  const [textInput, setTextInput] = useState({
    ingredients: '',
    nutrition: ''
  })

  const handleImagePreview = (file, type) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'ingredients') {
        setIngredientsImage(reader.result)
      } else {
        setNutritionImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Input Method Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 flex justify-center gap-4">
          <button
            onClick={() => setInputMethod('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputMethod === 'upload'
                ? 'bg-primary-dark dark:bg-primary-light text-white dark:text-gray-800'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiImage /> Image Upload
          </button>
          <button
            onClick={() => setInputMethod('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputMethod === 'text'
                ? 'bg-primary-dark dark:bg-primary-light text-white dark:text-gray-800'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FiType /> Manual Input
          </button>
        </div>

        {/* Main Input Area */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Ingredients</h3>
              <button 
                className="text-sm text-primary-dark dark:text-primary-light hover:underline"
                onClick={() => window.open(ingredientsExample, '_blank')}
              >
                View Example
              </button>
            </div>
            {inputMethod === 'upload' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center relative group min-h-[400px] flex flex-col justify-center">
                  {ingredientsImage ? (
                    <div className="relative">
                      <img 
                        src={ingredientsImage} 
                        alt="Ingredients" 
                        className="max-h-[300px] w-auto mx-auto"
                      />
                      <button
                        onClick={() => setIngredientsImage(null)}
                        className="mt-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImagePreview(e.target.files[0], 'ingredients')}
                        />
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Click to upload ingredients image
                        </p>
                      </label>
                      <img 
                        src={ingredientsExample} 
                        alt="Example ingredients"
                        className="mt-4 max-h-[200px] w-auto mx-auto opacity-50 group-hover:opacity-75 transition-opacity"
                      />
                      <p className="mt-2 text-xs text-gray-400">Example of ingredients list image</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                value={textInput.ingredients}
                onChange={(e) => setTextInput({ ...textInput, ingredients: e.target.value })}
                placeholder="Enter ingredients list..."
                className="w-full h-[400px] p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 
                focus:ring-primary-dark dark:focus:ring-primary-light"
              />
            )}
          </div>

          {/* Nutrition Facts Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Nutrition Facts</h3>
              <button 
                className="text-sm text-primary-dark dark:text-primary-light hover:underline"
                onClick={() => window.open(nutritionExample, '_blank')}
              >
                View Example
              </button>
            </div>
            {inputMethod === 'upload' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center relative group min-h-[400px] flex flex-col justify-center">
                  {nutritionImage ? (
                    <div className="relative">
                      <img 
                        src={nutritionImage} 
                        alt="Nutrition Facts" 
                        className="max-h-[300px] w-auto mx-auto"
                      />
                      <button
                        onClick={() => setNutritionImage(null)}
                        className="mt-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImagePreview(e.target.files[0], 'nutrition')}
                        />
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Click to upload nutrition facts image
                        </p>
                      </label>
                      <img 
                        src={nutritionExample} 
                        alt="Example nutrition facts"
                        className="mt-4 max-h-[200px] w-auto mx-auto opacity-50 group-hover:opacity-75 transition-opacity"
                      />
                      <p className="mt-2 text-xs text-gray-400">Example of nutrition facts image</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                value={textInput.nutrition}
                onChange={(e) => setTextInput({ ...textInput, nutrition: e.target.value })}
                placeholder="Enter nutrition facts..."
                className="w-full h-[400px] p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 
                focus:ring-primary-dark dark:focus:ring-primary-light"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            className="px-8 py-3 bg-gradient-to-r from-primary-dark to-accent-blue-dark 
            dark:from-primary-light dark:to-accent-blue-light text-white dark:text-gray-800 
            rounded-lg hover:from-primary hover:to-accent-blue transform transition-all 
            duration-200 hover:-translate-y-0.5"
          >
            Analyze Food
          </button>
        </div>
      </div>
    </div>
  )
}
