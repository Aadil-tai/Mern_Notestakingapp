import React from 'react';
import {
    FiCheckCircle,
    FiCode,
    FiServer,
    FiLayers,
    FiShield,
    FiSmartphone
} from 'react-icons/fi';
import { SiRedux, SiSimplelogin } from "react-icons/si";
import { GrIntegration } from "react-icons/gr";


import featuresData from '../data/FeaturesData';

const Features = () => {
    // Icon mapping
    const iconComponents = {
        FiServer,
        FiCode,
        FiLayers,
        FiShield,
        FiSmartphone,
        SiRedux, SiSimplelogin, GrIntegration
    };

    // Color mapping
    const colorClasses = {
        purple: {
            text: 'text-purple-400',
            border: 'border-purple-500',
            gradient: 'from-purple-400 to-indigo-300'
        },
        indigo: {
            text: 'text-indigo-400',
            border: 'border-indigo-500',
            gradient: 'from-indigo-400 to-blue-300'
        },
        pink: {
            text: 'text-pink-400',
            border: 'border-pink-500',
            gradient: 'from-pink-400 to-purple-300'
        },
        green: {
            text: 'text-green-400',
            border: 'border-green-500',
            gradient: 'from-green-400 to-teal-300'
        },
        yellow: {
            text: 'text-yellow-400',
            border: 'border-yellow-500',
            gradient: 'from-yellow-400 to-amber-300'
        },
        blue: {
            text: 'text-blue-400',
            border: 'border-blue-500',
            gradient: 'from-blue-400 to-cyan-300'
        }
    };

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                        Powerful Features, Solid Foundation
                    </h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        Discover what makes NoteCraft exceptional - from user experience to the robust architecture behind it.
                    </p>
                </div>

                {/* Development Journey */}
                <div className="mb-20">
                    <h3 className="text-2xl font-semibold mb-6 text-center text-purple-300">
                        My Development Journey
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {featuresData.developmentJourney.map((item, index) => {
                            const IconComponent = iconComponents[item.icon] || FiCode; // fallback icon
                            const colors = colorClasses[item.color];

                            return (
                                <div
                                    key={index}
                                    className={`bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 hover:${colors.border} transition-all`}
                                >
                                    <div className="flex items-center mb-4">
                                        <IconComponent className={`${colors.text} text-2xl mr-3`} />
                                        <h4 className="text-xl font-semibold">{item.title}</h4>
                                    </div>
                                    <ul className="space-y-3 text-gray-300">
                                        {item.items.map((point, i) => (
                                            <li key={i} className="flex items-start">
                                                <FiCheckCircle className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;