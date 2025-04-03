import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../assests/login.jpg';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

      // Use checkAuth instead of refreshAuth
      checkAuth();

      // Redirect to the home page on successful login
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left: Image Section */}
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
            src={loginImg}
            alt="Food Analysis" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <div className="bg-black/50 p-6 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 text-white">Analyze Your Food</h2>
              <p className="text-lg text-white/90">Get instant insights about your food's nutritional value</p>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="w-full lg:w-7/12 p-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-extrabold 
              bg-gradient-to-r from-[#FF4081] to-[#F50057] 
              text-transparent bg-clip-text 
              mb-8 text-center">
              Nutridex
            </h1>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Welcome Back!
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-pink-200 
                  bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4081]
                  transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-pink-200 
                  bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4081]
                  transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                to="/signup" 
                className="text-[#FF4081] hover:text-[#F50057] 
                font-medium transition-colors duration-300"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}