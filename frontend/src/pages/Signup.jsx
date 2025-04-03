import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../assests/signup.jpg';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Using fetch instead of axios to rule out any axios-specific issues
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // If response includes tokens (depends on your backend)
      if (data.message === "Registration successful") {
        // Show success message
        alert("Registration successful! Please login to continue.");
        navigate('/login');
      } else {
        // Handle any other successful response
        navigate('/login');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Right: Image Section */}
        <div className="hidden lg:block w-5/12 relative">
          {/* Geometric Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg 
              className="absolute w-full h-full opacity-40"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 500 800"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#FF4081', stopOpacity: 0.7}} />
                  <stop offset="100%" style={{stopColor: '#F50057', stopOpacity: 0.7}} />
                </linearGradient>
              </defs>
              <path 
                d="M0,0 L500,0 L500,800 L250,600 L0,800 Z" 
                fill="url(#pink-gradient)"
              />
            </svg>
          </div>

          <img 
            src={signupImg}
            alt="Food Scanning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <div className="bg-black/50 p-6 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 text-white">Join Nutridex Today</h2>
              <p className="text-lg text-white/90">Start making informed decisions about your food</p>
            </div>
          </div>
        </div>

        {/* Left: Form Section */}
        <div className="w-full lg:w-7/12 p-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-extrabold 
              bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-transparent bg-clip-text 
              mb-8 text-center">
              Nutridex
            </h1>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create Account
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-full border border-pink-200 
                  bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4081]
                  transition-all duration-300"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-full border border-pink-200 
                  bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4081]
                  transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-full border border-pink-200 
                    bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4081]
                    transition-all duration-300"
                    placeholder="Create password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-full border border-pink-200 
                    bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4081]
                    transition-all duration-300"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 
                bg-gradient-to-r from-[#FF4081] to-[#F50057]
                text-white font-semibold 
                rounded-full transition-all duration-300 
                hover:scale-105 hover:shadow-xl 
                shadow-[#FF4081]/30 transform
                disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                to="/login" 
                className="text-[#FF4081] hover:text-[#F50057] 
                font-medium transition-colors duration-300"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}