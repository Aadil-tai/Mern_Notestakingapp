import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import MainScreen from '../MainScreen';
import ErrorMesseage from '../ErrorMesseage';
import axios from 'axios';

const RegisterScreen = () => {
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const onSubmit = async (formData) => {
        if (formData.Password !== formData.ConfirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const data = new FormData();
            data.append("name", formData.Name);
            data.append("email", formData.Email);
            data.append("password", formData.Password);
            if (avatar) data.append("avatar", avatar);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data: resData } = await axios.post("/api/users", data, config);

            localStorage.setItem("userInfo", JSON.stringify(resData));
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainScreen title="Register">
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Register</h2>

                    {error && <ErrorMesseage>{error}</ErrorMesseage>}

                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full text-sm text-gray-600"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            {...register('Name', { required: 'Name is required' })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name.message}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('Email', { required: 'Email is required' })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('Password', {
                                required: 'Password is required',
                                maxLength: { value: 15, message: 'Password cannot exceed 15 characters' },
                            })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            {...register('ConfirmPassword', {
                                required: 'Confirm password is required',
                            })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.ConfirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.ConfirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.ConfirmPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="submit"
                            value={loading ? "Registering..." : "Register"}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </MainScreen>
    );
};

export default RegisterScreen;
