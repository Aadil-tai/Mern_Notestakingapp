import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { userInfo } = useSelector(state => state.userLogin);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (userInfo) navigate('/mynotes');
    }, [userInfo, navigate]);

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            };

            const { data } = await axios.post('/api/users/login', {
                email: formData.Email,
                password: formData.Password
            }, config);

            if (data.message === "Account not verified") {
                navigate('/verify-email', { state: { email: formData.Email } });
                return;
            }

            dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data });
            toast.success("Login successful!");
            navigate('/mynotes');

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed";
            if (error.response?.status === 403) {
                navigate('/verify-account', { state: { email: formData.Email } });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-8 space-y-4"
                >
                    <div className="flex items-center gap-2">
                        <img src="https://flowbite.com/docs/images/logo.svg" alt="Logo" className="h-6" />
                        <h1 className="text-xl font-semibold text-gray-900">Quick Note</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-sm text-gray-500">
                        Login to access your account. Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">Register here.</Link>
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Your Email</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                {...register('Email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                {...register('Password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                className={`w-full px-4 py-2 rounded-lg border ${errors.Password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.Password && <p className="text-red-500 text-xs mt-1">{errors.Password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Login'}
                        </button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Forgot password?{' '}
                                <Link to="/reset-password" className="text-blue-600 hover:underline font-medium">
                                    Reset here
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>

                {/* Illustration Section */}
                <div className="hidden md:flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                    <img src="/register.png" alt="Illustration" className="w-4/5" />
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
