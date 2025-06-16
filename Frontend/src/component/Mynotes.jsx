import React, { useState } from 'react';
import MainScreen from './MainScreen';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNoteAction, listnotes } from '../actions/noteActions';
import ErrorMesseage from './ErrorMesseage';
import NoteCard from './Notecard';
const Mynotes = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const noteList = useSelector(state => state.noteList)

    const { loading, notes, error } = noteList

    const { userInfo } = useSelector(state => state.userLogin);

    const noteDelete = useSelector(state => state.noteDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = noteDelete




    const [openIndex, setOpenIndex] = useState(null);
    // const [notes, setNotes] = useState([])
    const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // const fetchNotes = async () => {
    //     const { data } = await axios.get("/api/notes")
    //     setNotes(data);
    // }
    const handleDelete = (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            // Add your delete logic here

            dispatch(deleteNoteAction(noteId))
        }
    };
    const searchQuery = useSelector((state) => state.searchQuery);
    useEffect(() => {
        if (!userInfo) {
            navigate('/');
        } else {
            dispatch(listnotes());
        }
    }, [dispatch, navigate, userInfo, successDelete, searchQuery]);


    return (
        <div className="relative min-h-screen px-6 py-10 overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 animate-gradient-slow">
            {/* Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_#ffffff1a_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

            {/* Foreground Content */}
            {userInfo && (
                <MainScreen title={`Welcome back... ${userInfo.name}`}>
                    <div className="space-y-6 max-w-4xl mx-auto relative z-10">
                        <div className="flex justify-end mb-4">
                            <Link
                                to="/create-note"
                                className="inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                + Create Note
                            </Link>
                        </div>

                        {error && <ErrorMesseage variant='danger'>{error}</ErrorMesseage>}
                        {errorDelete && <ErrorMesseage variant='danger'>{errorDelete}</ErrorMesseage>}

                        {notes?.filter((note) =>
                            note.title.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((note, index) => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                index={index}
                                isOpen={openIndex === index}
                                onToggle={() => toggleIndex(index)}
                                onDelete={() => handleDelete(note._id)}
                            />
                        ))}
                    </div>
                </MainScreen>
            )}
        </div>

    );
};

export default Mynotes;
