import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const getCardBg = (index) => {
    const backgrounds = [
        'from-indigo-50 via-white to-cyan-50',
        'from-rose-50 via-white to-orange-50',
        'from-violet-50 via-white to-purple-50',
        'from-emerald-50 via-white to-teal-50'
    ];
    return backgrounds[index % backgrounds.length];
};

const getCategoryStyle = (category) => {
    const styles = {
        Programming: 'from-purple-500 via-pink-500 to-red-500',
        Health: 'from-green-400 via-blue-500 to-purple-600',
        Projects: 'from-yellow-400 via-red-500 to-pink-500',
        default: 'from-blue-400 via-purple-500 to-pink-500'
    };
    return styles[category] || styles.default;
};

const NoteCard = ({ note, index, isOpen, onToggle, onDelete }) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${getCardBg(index)} backdrop-blur-lg border border-white/20  hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 cursor-pointer`}
            style={{
                clipPath: isOpen
                    ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                    : 'polygon(0% 0%, 100% 0%, 95% 85%, 0% 100%)'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getCategoryStyle(note.category)} opacity-20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`}
            ></div>

            <div className="relative p-8 z-10">
                <div
                    className={`inline-block mb-4 px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getCategoryStyle(note.category)} shadow-lg`}
                    style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                >
                    {note.category}
                </div>

                <h2
                    className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-700 transition-colors duration-300 flex justify-between items-center select-none"
                    onClick={onToggle}
                >
                    <span className="flex-1 pr-4">{note.title}</span>
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {isOpen ? '−' : '+'}
                    </div>
                </h2>

                <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-4">
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30"
                            style={{ clipPath: 'polygon(0% 0%, 95% 0%, 100% 80%, 5% 100%, 0% 20%)' }}>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                                {note.content}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mb-6 text-gray-600 text-sm font-medium">
                            <span>
                                Created on {new Date(note.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Link
                                to={`/note/${note._id}`}
                                className="group/btn flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                                title="Edit Note"
                            >
                                <FaEdit className="text-lg group-hover/btn:rotate-12 transition-transform duration-300" />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="group/btn flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                                title="Delete Note"
                            >
                                <FaTrash className="text-lg group-hover/btn:rotate-12 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {!isOpen && (
                    <div className="mt-6 flex justify-center">
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
