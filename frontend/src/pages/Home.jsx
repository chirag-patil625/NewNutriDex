import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Microscope, 
  ShieldCheck, 
  TrendingUp,
  Camera,
  Search,
  CheckCircle,
  TrendingUp as Trend
} from 'lucide-react';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    workflow: false,
    features: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const workflowSection = document.getElementById('workflow-section');
      const featuresSection = document.getElementById('features-section');

      if (workflowSection) {
        const rect = workflowSection.getBoundingClientRect();
        const isVisible = (rect.top < window.innerHeight * 0.75 && rect.bottom >= 0);
        setVisibleSections(prev => ({ ...prev, workflow: isVisible }));
      }

      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        const isVisible = (rect.top < window.innerHeight * 0.75 && rect.bottom >= 0);
        setVisibleSections(prev => ({ ...prev, features: isVisible }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { 
      icon: <Microscope className="w-16 h-16 text-[#FF4081]" />, 
      title: "Precision Nutrition Scan", 
      description: "Advanced OCR technology extracts precise nutritional data with unprecedented accuracy.",
      color: "from-pink-500 to-pink-600"
    },
    { 
      icon: <ShieldCheck className="w-16 h-16 text-[#F50057]" />, 
      title: "Intelligent Health Rating", 
      description: "Comprehensive algorithm provides nuanced health insights beyond simple metrics.",
      color: "from-rose-500 to-rose-600"
    },
    { 
      icon: <TrendingUp className="w-16 h-16 text-[#FF4081]" />, 
      title: "Nutritional Insights", 
      description: "Deep analytical breakdown of ingredients, revealing hidden nutritional complexities.",
      color: "from-fuchsia-500 to-fuchsia-600"
    }
  ];

  const workflowSteps = [
    {
      icon: <Camera className="w-12 h-12 text-pink-600" />,
      title: "Upload Food Label",
      description: "Capture or upload a clear image of your food product's nutrition label.",
      color: "bg-pink-50",
      stairClass: "md:ml-0 md:mr-auto"
    },
    {
      icon: <Search className="w-12 h-12 text-rose-600" />,
      title: "Advanced OCR Extraction",
      description: "Our AI-powered OCR technology precisely extracts nutritional information.",
      color: "bg-rose-50",
      stairClass: "md:ml-auto md:mr-0"
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-fuchsia-600" />,
      title: "Intelligent Analysis",
      description: "Complex algorithms evaluate nutritional content and health impact.",
      color: "bg-fuchsia-50",
      stairClass: "md:ml-0 md:mr-auto"
    },
    {
      icon: <Trend className="w-12 h-12 text-purple-600" />,
      title: "Personalized Insights",
      description: "Receive comprehensive nutrition ratings and personalized recommendations.",
      color: "bg-purple-50",
      stairClass: "md:ml-auto md:mr-0"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] overflow-x-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block">
            <h1 className="text-5xl md:text-7xl font-extrabold 
              bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-transparent bg-clip-text 
              mb-6 tracking-tight">
              Nutridex
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 
            leading-relaxed max-w-2xl mx-auto font-medium">
            Revolutionize Your Nutrition Understanding with Intelligent Food Analysis
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex justify-center space-x-4">
            <NavLink 
              to="/scan"
              className="flex items-center gap-2 
              bg-gradient-to-r from-[#FF4081] to-[#F50057]
              text-white font-semibold py-3.5 px-7 
              rounded-full transition-all duration-300 
              hover:scale-105 hover:shadow-xl 
              shadow-[#FF4081]/30 transform"
            >
              Scan Food Label
            </NavLink>
            <NavLink 
              to="/manual-entry"
              className="flex items-center gap-2 
              bg-white border border-pink-200
              text-[#FF4081] font-semibold py-3.5 px-7 
              rounded-full transition-all duration-300 
              hover:bg-pink-50 hover:scale-105 
              shadow-md"
            >
              Manual Entry
            </NavLink>
          </div>
        </div>

        {/* Stair-like Workflow Section */}
        <div 
          id="workflow-section" 
          className="max-w-6xl mx-auto mb-16 relative"
        >
          <h2 className="text-3xl font-bold text-center mb-16 
            bg-gradient-to-r from-[#FF4081] to-[#F50057] 
            text-transparent bg-clip-text">
            How Nutridex Works
          </h2>
          
          {/* Ladder Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-32 bottom-32 w-1 bg-gradient-to-b from-pink-200 via-rose-200 to-purple-200"></div>
          
          <div className="relative w-full space-y-16 md:space-y-24">
            {workflowSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center w-full md:w-2/3 
                  ${step.stairClass} 
                  transition-all duration-700 ease-in-out transform 
                  ${visibleSections.workflow 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-10 scale-95'}`}
              >
                {/* Step Content */}
                <div className="flex items-center w-full">
                  {/* Icon Container */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center 
                    ${step.color} border-4 border-white shadow-lg mr-6 flex-shrink-0 
                    relative z-10`}>
                    {step.icon}
                  </div>
                  
                  {/* Text Container */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Section */}
        <div 
          id="features-section"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              onMouseEnter={() => setActiveFeature(index)}
              className={`relative group cursor-pointer 
                transform transition-all duration-500 
                ${visibleSections.features 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'}
                ${activeFeature === index ? 'scale-105' : 'scale-95 opacity-60'}
                hover:scale-105 hover:opacity-100`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} 
                rounded-full opacity-0 group-hover:opacity-10 
                transition-opacity duration-500 blur-3xl`}></div>
              
              <div className="relative z-10 flex flex-col items-center 
                text-center p-6 rounded-3xl transition-all duration-500">
                <div className="mb-5 bg-white rounded-full p-4 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 max-w-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;