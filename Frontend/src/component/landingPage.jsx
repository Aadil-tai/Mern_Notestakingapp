import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const buttonStyles = "w-40 py-3 text-center font-semibold rounded-lg shadow transition text-base";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-100 to-blue-300">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center leading-snug">
                Welcome to <span className="text-blue-700">NoteCraft</span> ✍️
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                    <button className={`${buttonStyles} bg-blue-600 hover:bg-blue-700 text-white`}>
                        Login
                    </button>
                </Link>
                <Link to="/signup">
                    <button className={`${buttonStyles} bg-white hover:bg-gray-100 text-blue-600 border border-blue-600`}>
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
