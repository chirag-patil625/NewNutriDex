import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { useLocation, Navigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

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

  const getScoreDetails = (score) => {
    if (score >= 90) {
      return {
        category: "Superfoods & Whole Foods",
        description: "Excellent nutritional value with minimal processing",
        color: "text-emerald-500",
        ringColor: "text-emerald-500"
      };
    } else if (score >= 60) {
      return {
        category: "Healthy but Some Processing",
        description: "Good nutritional profile with moderate processing",
        color: "text-yellow-500",
        ringColor: "text-yellow-500"
      };
    } else if (score >= 30) {
      return {
        category: "Moderately Processed & Less Nutritious",
        description: "Higher processing with some nutritional concerns",
        color: "text-orange-500",
        ringColor: "text-orange-500"
      };
    } else {
      return {
        category: "Highly Processed & Poor Nutrition",
        description: "Heavy processing with significant nutritional concerns",
        color: "text-red-500",
        ringColor: "text-red-500"
      };
    }
  };

  const { offset, circumference } = calculateCircleProgress(historyData.scores.total);
  const scoreDetails = getScoreDetails(historyData.scores.total);

  // Prepare data for pie chart
  const nutritionChartData = {
    labels: Object.keys(historyData.nutrition_data).map(key => 
      key.replace(/_/g, ' ')
    ),
    datasets: [{
      data: Object.values(historyData.nutrition_data),
      backgroundColor: [
        'rgb(255, 99, 71)',     // Tomato Red
        'rgb(30, 144, 255)',    // Dodger Blue
        'rgb(255, 215, 0)',     // Gold
        'rgb(138, 43, 226)',    // Blue Violet
        'rgb(50, 205, 50)',     // Lime Green
        'rgb(255, 140, 0)',     // Dark Orange
        'rgb(0, 206, 209)',     // Turquoise
        'rgb(219, 112, 147)',   // Pale Violet Red
        'rgb(0, 128, 128)',     // Teal
      ],
      borderColor: '#FFF',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          },
          padding: 20
        }
      }
    },
    maintainAspectRatio: true,
  };

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
                className="text-gray-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className={`${scoreDetails.ringColor} transition-all duration-500`}
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
          <div className="mt-4">
            <p className={`text-lg font-semibold ${scoreDetails.color}`}>
              {scoreDetails.category}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {scoreDetails.description}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text mb-4">
            Analysis Summary
          </h2>
          <p className="text-gray-600">{historyData.analysis_summary}</p>
        </div>

        {/* Ingredients Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold 
              bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-transparent bg-clip-text mb-4">
              Ingredients Analysis
            </h2>
            {/* Add Ingredients Score */}
            <div className="mb-4 p-4 bg-pink-50 rounded-lg">
              <p className="text-gray-700 font-medium mb-2">Ingredients Score</p>
              <div className="flex items-baseline">
                <span className="text-4xl md:text-5xl font-bold text-[#FF4081]">
                  {formatScore(historyData.scores.ingredients)}
                </span>
                <span className="text-sm text-gray-400 ml-1 mt-2">/100</span>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#FF4081] h-2.5 rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${historyData.scores.ingredients}%` }}
                ></div>
              </div>
            </div>
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
            
            {/* Add Pie Chart */}
            <div className="mb-6">
              <Pie data={nutritionChartData} options={chartOptions} />
            </div>

            {/* Existing nutrition facts table */}
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
