import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormComponents/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import MainScreen from './MainScreen';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateNoteAction } from '../actions/noteActions';

const NoteUpdateForm = () => {
    const { id } = useParams(); // ✅ correct param usage
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const methods = useForm();
    const { handleSubmit, reset, setValue, getValues } = methods;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch note by ID
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const { data } = await axios.get(`/api/notes/${id}`);
                setValue("title", data.title);
                setValue("content", data.content);
                setValue("category", data.category);
                setLoading(false);
            } catch (err) {
                setError("Failed to load note.");
                setLoading(false);
            }
        };

        fetchNote();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const { title, content, category } = data;

        try {
            await dispatch(updateNoteAction(id, title, content, category));
            navigate("/mynotes");
        } catch (error) {
            console.error("Update failed:", err);
        }


        reset();
        navigate("/mynotes");
    };

    const handleReset = () => {
        const { title, content, category } = getValues(); // reset to current form values
        reset({ title, content, category });
    };

    if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

    return (
        <MainScreen title={"Edit Note"}>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg space-y-6"
                    >
                        <h2 className="text-2xl font-semibold text-center text-gray-800">Update Note</h2>

                        <FormInput
                            name="title"
                            placeholder="Enter Title"
                            validation={{ required: "Title is required" }}
                        />

                        <FormInput
                            name="content"
                            placeholder="Enter Content"
                            validation={{ required: "Content is required" }}
                        />

                        <FormInput
                            name="category"
                            placeholder="Enter Category"
                            validation={{ required: "Category is required" }}
                        />

                        <div className="flex justify-between gap-4">
                            <input
                                type="submit"
                                value="Update Note"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                            />

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </MainScreen>
    );
};

export default NoteUpdateForm;
