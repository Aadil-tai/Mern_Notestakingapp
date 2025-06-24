import React, { useEffect, useState } from 'react';
import MainScreen from '../MainScreen';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorMesseage from '../ErrorMesseage';
import { useDispatch, useSelector } from 'react-redux';
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
                withCredentials: true // Important for cookies
            };

            const { data } = await axios.post(
                '/api/users/login',
                {
                    email: formData.Email,
                    password: formData.Password
                },
                config
            );

            // Handle unverified accounts
            if (data.message === "Account not verified") {
                navigate('/verify-email', { state: { email: formData.Email } });
                return;
            }

            dispatch({
                type: 'USER_LOGIN_SUCCESS',
                payload: data
            });

            toast.success("Login successful!");
            navigate('/mynotes');

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed";

            // Special handling for unverified accounts
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
        <MainScreen title="Login">
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('Email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Email && (
                            <p className="text-red-500 text-sm mt-1">{errors.Email.message}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('Password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            className={`w-full px-4 py-2 rounded-lg border ${errors.Password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.Password && (
                            <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : "Login"}
                    </button>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            New user?{' '}
                            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                                Register
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            <Link to="/reset-password" className="text-blue-600 hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </MainScreen>
    );
};

export default LoginScreen;