import React, { useState } from 'react';
import MainScreen from '../MainScreen';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMesseage from '../ErrorMesseage';

const LoginScreen = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null); // ✅

    const [error, setError] = useState(null);//for showing api
    // // const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    // const apiBaseUrl = "http://localhost:5000";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            // console.log('API base URL:', apiBaseUrl);
            setError(null);
            setSuccess(null); // Clear old success

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const { data } = await axios.post(
                `/api/users/login`,
                {
                    email: formData.Email,
                    password: formData.Password
                },
                config
            );

            console.log("Login success:", data);
            setSuccess("Login successful! 🎉");
        } catch (error) {
            console.error("Login failed:", error);
            setError(error.response?.data.message || "Login failed. Please try again.")
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainScreen title="Login">
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
                    {success && <ErrorMesseage variant="green">{success}</ErrorMesseage>}

                    {error && <ErrorMesseage>{error}</ErrorMesseage>}
                    {/* Email Field */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('Email', { required: 'Email is required' })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Email && (
                            <p className="text-red-500 text-sm mt-1">{errors.Email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('Password', {
                                required: 'Password is required',
                                maxLength: {
                                    value: 15,
                                    message: 'Password cannot exceed 15 characters',
                                },
                            })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Password && (
                            <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <input
                            type="submit"
                            value={loading ? "Logging in..." : "Login"}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                            disabled={loading}
                        />
                    </div>

                    {/* Redirect to Register */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            New user?{' '}
                            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </MainScreen>
    );
};

export default LoginScreen;
