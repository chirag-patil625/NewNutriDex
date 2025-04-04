import React from 'react';
import { FiGithub, FiMail, FiInstagram, FiAlertCircle } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Warning Message */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-center text-yellow-700 bg-yellow-50 px-4 py-3 rounded-lg">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0 mr-2" />
            <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              NutriDex ratings may sometimes misjudge food products — Always verify before making dietary decisions
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 ">
          <a href="https://github.com/chirag-patil625/Nutridex" className="text-gray-500 hover:text-[#FF4081] transition-colors">
            <FiGithub className="w-6 h-6" />
          </a>
          <a href="mailto:chiragpatil7798@gmail.com" className="text-gray-500 hover:text-[#FF4081] transition-colors">
            <FiMail className="w-6 h-6" />
          </a>
          <a href="https://www.instagram.com/chiragggg_fit/" className="text-gray-500 hover:text-[#FF4081] transition-colors">
            <FiInstagram className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}