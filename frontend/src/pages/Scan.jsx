import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  ShieldCheck 
} from 'lucide-react';

// Import example images (you'll need to replace these with actual paths)
import ingredientsExample from '../assests/ingredients.png';
import nutritionExample from '../assests/nutritionfacts.jpg';

const Scan = () => {
  const [inputMethod, setInputMethod] = useState('upload');
  const [nutritionImage, setNutritionImage] = useState(null);
  const [ingredientsImage, setIngredientsImage] = useState(null);
  const [textInput, setTextInput] = useState({
    ingredients: '',
    nutrition: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'nutrition') {
        setNutritionImage({ preview: reader.result, file });
      } else {
        setIngredientsImage({ preview: reader.result, file });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type) => {
    if (type === 'nutrition') {
      setNutritionImage(null);
    } else {
      setIngredientsImage(null);
    }
  };

  const renderImageUploader = (image, exampleImage, type, title) => (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold 
          bg-gradient-to-r from-[#FF4081] to-[#F50057] 
          text-transparent bg-clip-text">
          {title}
        </h3>
        <button 
          className="text-sm text-[#FF4081] hover:underline"
          onClick={() => window.open(exampleImage, '_blank')}
        >
          View Example
        </button>
      </div>
      <div className="border-4 border-dashed border-pink-200 
        rounded-2xl min-h-[400px] flex flex-col justify-center items-center 
        text-center p-6 transition-all duration-300 hover:border-pink-300">
        {image ? (
          <div className="relative">
            <img 
              src={image.preview} 
              alt={`${title} preview`} 
              className="max-h-[300px] w-auto mx-auto rounded-lg shadow-lg"
            />
            <button
              onClick={() => handleRemoveImage(type)}
              className="absolute top-2 right-2 bg-red-500 text-white 
              rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <Camera className="w-16 h-16 text-[#FF4081] mb-4"/>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Upload {title}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PNG, JPG, JPEG
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], type)}
            />
            <div className="bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-white px-6 py-3 rounded-full 
              flex items-center gap-2 
              hover:scale-105 transition-transform">
              <Upload className="w-5 h-5"/>
              Upload Image
            </div>
            <img 
              src={exampleImage} 
              alt={`Example ${title}`}
              className="mt-4 max-h-[200px] w-auto mx-auto opacity-50 group-hover:opacity-75 transition-opacity"
            />
            <p className="mt-2 text-xs text-gray-400">Example of {title.toLowerCase()} image</p>
          </label>
        )}
      </div>
      {inputMethod === 'text' && (
        <textarea
          value={type === 'nutrition' ? textInput.nutrition : textInput.ingredients}
          onChange={(e) => setTextInput({ 
            ...textInput, 
            [type]: e.target.value 
          })}
          placeholder={`Enter ${title.toLowerCase()}...`}
          className="w-full h-[400px] mt-4 p-4 rounded-lg bg-white border border-gray-200 
          text-gray-800 focus:ring-2 focus:ring-[#FF4081]"
        />
      )}
    </div>
  );

  const handleAnalyze = async () => {
    if (!nutritionImage || !ingredientsImage) {
      alert('Please upload both nutrition facts and ingredients images');
      return;
    }

    setIsProcessing(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('nutrition_image', nutritionImage.file);
      formData.append('ingredients_image', ingredientsImage.file);

      const response = await fetch('http://localhost:8000/result_api/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze images');
      }

      // Navigate to results page with the data
      navigate('/result', { state: { analysisData: data } });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze images. Please try again.');
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
          Processing Images
        </div>
        <div className="text-gray-600 text-center max-w-sm px-4">
          Please wait while we analyze your food label. This might take a few moments.
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
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text 
            mb-6 tracking-tight">
            Nutridex Scan
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Capture Your Food Label for Intelligent Nutritional Analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Ingredients Section */}
          <div>
            {renderImageUploader(
              ingredientsImage, 
              ingredientsExample, 
              'ingredients', 
              'Ingredients'
            )}
          </div>

          {/* Nutrition Facts Section */}
          <div>
            {renderImageUploader(
              nutritionImage, 
              nutritionExample, 
              'nutrition', 
              'Nutrition Facts'
            )}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={!nutritionImage || !ingredientsImage}
            className="flex items-center gap-2 mx-auto
            bg-gradient-to-r from-[#FF4081] to-[#F50057]
            text-white font-semibold py-3.5 px-7 
            rounded-full transition-all duration-300 
            hover:scale-105 hover:shadow-xl 
            shadow-[#FF4081]/30 transform
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-6 h-6"/>
            Analyze Food Label
          </button>
        </div>

        {/* Tips Section */}
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
          <h3 className="text-2xl font-bold text-center mb-6 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text">
            Tips for Best Results
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-pink-50 p-4 rounded-2xl">
              <Camera className="w-12 h-12 text-pink-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Clear Image</h4>
                <p className="text-sm text-gray-600">
                  Ensure the label is well-lit and fully visible
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-rose-50 p-4 rounded-2xl">
              <ShieldCheck className="w-12 h-12 text-rose-600" />
              <div>
                <h4 className="font-semibold text-gray-800">No Glare</h4>
                <p className="text-sm text-gray-600">
                  Avoid shadows or reflections on the label
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fuchsia-50 p-4 rounded-2xl">
              <Upload className="w-12 h-12 text-fuchsia-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Proper Angle</h4>
                <p className="text-sm text-gray-600">
                  Take photo directly above the label
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-2xl">
              <CheckCircle className="w-12 h-12 text-purple-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Readability</h4>
                <p className="text-sm text-gray-600">
                  Ensure text is clear and legible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;