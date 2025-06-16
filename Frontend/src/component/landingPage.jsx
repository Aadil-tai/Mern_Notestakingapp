import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-800 via-indigo-900 to-black text-white px-4 text-center">
            {/* Logo / Icon */}
            <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-2xl shadow-lg">
                    <span className="text-3xl">✍️</span>
                </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">NoteCraft</h1>
            <p className="text-lg sm:text-xl max-w-xl text-gray-300">
                Organize your thoughts with style. Create, update and manage notes effortlessly.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition">
                        Get Started
                    </button>
                </Link>
                <Link to="/signup">
                    <button className="px-6 py-3 border border-gray-400 hover:border-white rounded-lg font-semibold transition">
                        Learn More
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
