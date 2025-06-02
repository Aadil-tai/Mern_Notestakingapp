import React, { useState } from 'react';
import MainScreen from './MainScreen';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Mynotes = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [notes, setNotes] = useState([])
    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const fetchNotes = async () => {
        const { data } = await axios.get("/api/notes")
        setNotes(data);
    }
    const handleDelete = (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            // Add your delete logic here
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [])

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-100 to-blue-300">
            <MainScreen title="Welcome back">
                <div className="space-y-6 max-w-4xl mx-auto">
                    {notes.map((note, index) => (
                        <div
                            key={note._id}
                            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                        >
                            <h2
                                className="text-2xl font-semibold text-gray-900 mb-3 truncate flex justify-between items-center select-none"
                                onClick={() => toggleIndex(index)}
                            >
                                {note.title}
                                <span className="text-3xl font-bold text-blue-600">
                                    {openIndex === index ? '−' : '+'}
                                </span>
                            </h2>

                            {openIndex === index && (
                                <>
                                    <blockquote className="text-gray-700 italic mb-4 border-l-4 border-blue-400 pl-6">
                                        <p className="mb-2 whitespace-pre-line">{note.content}</p>
                                        <footer className="text-sm text-gray-500">
                                            Created on — <time dateTime="2024-01-01">Jan 1, 2024</time>
                                        </footer>
                                    </blockquote>

                                    <div className="flex gap-6 text-gray-600 justify-end">
                                        <Link
                                            to={`/note/${note._id}`}
                                            className="hover:text-blue-600 transition-colors duration-300"
                                            title="Edit Note"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <FaEdit size={22} />
                                        </Link>
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDelete(note._id);
                                            }}
                                            className="hover:text-red-600 transition-colors duration-300"
                                            title="Delete Note"
                                        >
                                            <FaTrash size={22} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </MainScreen>
        </div>
    );
};

export default Mynotes;
