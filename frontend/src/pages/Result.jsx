import React from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useLocation, Navigate } from 'react-router-dom';

export default function Result() {
  const location = useLocation();
  const analysisData = location.state?.analysisData;

  // Redirect if no data is present
  if (!analysisData) {
    return <Navigate to="/scan" replace />;
  }

  // Helper function to format score and calculate circle
  const formatScore = (score) => {
    return score.toFixed(1);
  };

  const calculateCircleProgress = (score) => {
    const normalizedScore = Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
    const circumference = 2 * Math.PI * 58;
    const offset = circumference - (normalizedScore / 100) * circumference;
    return { offset, circumference };
  };

  // Get circle values
  const { offset, circumference } = calculateCircleProgress(analysisData.total_score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Health Score */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
          <h2 className="text-2xl font-semibold 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text mb-4">
            Health Score
          </h2>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                className="text-pink-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-[#FF4081] transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <span className="absolute text-3xl font-bold text-gray-800">
              {formatScore(analysisData.total_score)}%
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text mb-4">
            Analysis Summary
          </h2>
          <p className="text-gray-600">{analysisData.analysis_summary}</p>
        </div>

        {/* Ingredients Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold 
              bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-transparent bg-clip-text mb-4">
              Ingredients Analysis
            </h2>
            <div className="space-y-4">
              {analysisData.ingredients.raw_data.map((ingredient, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-900">{ingredient}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold 
              bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-transparent bg-clip-text mb-4">
              Nutrition Facts
            </h2>
            <div className="space-y-3">
              {Object.entries(analysisData.nutrition.data).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-pink-200">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium text-[#FF4081]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}