import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import FormInput from './FormComponents/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../utils/userAction';

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading, error, success } = userUpdate;



    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const methods = useForm({
        defaultValues: {
            name: 'John Doe',
            email: 'john@example.com',
            password: '',
            confirmPassword: '',
            profilePic: null,
        },
    });

    const { handleSubmit, reset, setValue, watch } = methods;
    const password = watch('password');

    const onSubmit = (data) => {
        const { name, email, password, confirmPassword, profilePic } = data;

        if (password === confirmPassword) {
            dispatch(updateProfile({ name, email, password, pic: profilePic }));
        }
    };


    const handleCancel = () => {
        reset();
        setPreviewImage(null);
        setIsEditing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('profilePic', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        } else {
            reset({
                name: userInfo.name || '',
                email: userInfo.email || '',
                password: userInfo.password || '',
                confirmPassword: userInfo.password || '',
                pic: userInfo.pic
            });


        }
    }, [navigate, userInfo, reset]);

    return (
        <div className="min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
            <div className="w-full max-w-6xl bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start gap-10">
                    {/* Left: Profile Form */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
                            {!isEditing && (
                                <button
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                    onClick={() => setIsEditing(true)}
                                    title="Edit Profile"
                                >
                                    <FaEdit size={22} />
                                </button>
                            )}
                        </div>

                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormInput
                                    name="name"
                                    label="Full Name"
                                    disabled={!isEditing}
                                    validation={{ required: 'Full name is required' }}
                                />

                                <FormInput
                                    name="email"
                                    type="email"
                                    label="Email"
                                    disabled={!isEditing}
                                    validation={{ required: 'Email is required' }}
                                />

                                <FormInput
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="********"
                                    disabled={!isEditing}
                                />

                                <FormInput
                                    name="confirmPassword"
                                    type="password"
                                    label="Confirm Password"
                                    placeholder="********"
                                    disabled={!isEditing}
                                    validation={{
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
                                    }}
                                />

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}
                            </form>
                        </FormProvider>
                    </div>

                    {/* Right: Profile Picture */}
                    <div className="w-full md:w-64 text-center">
                        <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={
                                    previewImage || userInfo?.pic || 'https://via.placeholder.com/150?text=Profile'
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />

                            {isEditing && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                />
                            )}
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                            {isEditing ? 'Click image to upload' : 'Profile Picture'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
