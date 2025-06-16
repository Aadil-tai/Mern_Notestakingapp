import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './FormComponents/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { createNoteAction } from '../actions/noteActions';
import { useNavigate } from 'react-router-dom';

const NoteCreateForm = () => {

    const navigate = useNavigate()
    const methods = useForm();
    const { handleSubmit, reset } = methods;
    const dispatch = useDispatch();
    const [submitting, setSubmitting] = useState(false);

    const noteCreate = useSelector((state) => state.noteCreate);
    const { loading, error, note } = noteCreate

    const onSubmit = (data) => {
        setSubmitting(true);

        const { title, content, category } = data;
        dispatch(createNoteAction(title, content, category));
        console.log("Form Submitted:", data);


        setTimeout(() => {
            reset();
            setSubmitting(false); // optional since navigate replaces
            navigate("/mynotes");
        }, 3000);
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Create a Note</h2>

                   
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
                            value={submitting ? "Creating..." : "Create Note"}
                            disabled={loading}
                            className={`w-full ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                } text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300`}
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
    );
};

export default NoteCreateForm;
