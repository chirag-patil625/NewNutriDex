import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiActivity, FiClock } from 'react-icons/fi';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/profile/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user-history/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.data.success) {
          setHistoryData(response.data.history);
        }
      } catch (err) {
        console.error('History fetch error:', err);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHistoryClick = (historyItem) => {
    navigate('/history', { state: { historyData: historyItem } });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] flex items-center justify-center">
        <div className="text-[#FF4081] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF0F5] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-[#FF4081] to-[#F50057]">
            {/* Profile Info */}
            <div className="px-8 pt-20 pb-24 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl text-[#FF4081] font-bold">
                  {user?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user?.full_name}</h1>
                  <p className="text-pink-100 mt-1">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Curved bottom */}
            <div className="absolute bottom-0 inset-x-0">
              <svg viewBox="0 0 224 12" fill="white" className="w-full">
                <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0145422 L0,12.0145422 L0,0Z"/>
              </svg>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100">
                <div className="flex items-center space-x-3 text-[#FF4081] mb-4">
                  <FiUser className="w-5 h-5" />
                  <h3 className="font-semibold">Account Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-gray-800 font-medium mt-1">{profileData?.full_name || user?.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <p className="text-gray-800 font-medium mt-1">{profileData?.email || user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Member Since</label>
                    <p className="text-gray-800 font-medium mt-1">
                      {new Date(profileData?.date_joined || Date.now()).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100">
                <div className="flex items-center space-x-3 text-[#FF4081] mb-4">
                  <FiActivity className="w-5 h-5" />
                  <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {historyData.length === 0 ? (
                    <p className="text-center text-gray-600">No recent activity</p>
                  ) : (
                    historyData.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className="w-full p-3 rounded-lg bg-white hover:bg-pink-50 
                          transition-colors border border-pink-100 text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-800">
                              Analysis Score: {item.scores.total.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(item.created_at).toLocaleString()}
                            </div>
                          </div>
                          <FiClock className="text-[#FF4081] w-5 h-5" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FF4081] to-[#F50057] 
                  text-white font-semibold rounded-xl transition-all duration-300 
                  hover:scale-105 hover:shadow-xl shadow-[#FF4081]/30 transform"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
