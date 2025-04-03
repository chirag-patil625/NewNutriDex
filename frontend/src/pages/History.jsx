import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { useLocation, Navigate } from 'react-router-dom';

export default function History() {
  const location = useLocation();
  const historyData = location.state?.historyData;

  if (!historyData) {
    return <Navigate to="/profile" replace />;
  }

  const formatScore = (score) => {
    return score.toFixed(1);
  };

  const calculateCircleProgress = (score) => {
    const normalizedScore = Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
    const circumference = 2 * Math.PI * 58;
    const offset = circumference - (normalizedScore / 100) * circumference;
    return { offset, circumference };
  };

  const { offset, circumference } = calculateCircleProgress(historyData.scores.total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Date and Time Banner */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-[#FF4081]">
            <FiCalendar className="w-5 h-5" />
            <span className="text-gray-600 font-medium">
              Analyzed on: {new Date(historyData.created_at).toLocaleString()}
            </span>
          </div>
        </div>

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
              {formatScore(historyData.scores.total)}%
            </span>
          </div>
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
              {historyData.ingredients_data.raw_data.map((ingredient, index) => (
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
              {Object.entries(historyData.nutrition_data).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-pink-200">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
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
