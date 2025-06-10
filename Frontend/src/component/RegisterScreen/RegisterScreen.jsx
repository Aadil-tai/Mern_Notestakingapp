import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'; // Make sure this is imported at the top

import MainScreen from '../MainScreen';
import ErrorMesseage from '../ErrorMesseage';
import axios from 'axios';

const RegisterScreen = () => {
    const [avatar, setavatar] = useState("");
    const [avatarMessage, setavatarMessage] = useState("");


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);//for showing api
    const navigate = useNavigate();

    const handleAvatarChange = (e) => {
        setavatar(e.target.files[0]);
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (data.Password !== data.ConfirmPassword) {
            setError("Password Do not match");
            return;
        }
        else {
            setError(null)
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("name", data.Name);
                formData.append("email", data.Email);
                formData.append("password", data.Password);
                formData.append("avatar", avatar); // the actual file

                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };

                const { data: resData } = await axios.post("/api/users", formData, config);

                setLoading(true)

                // const { data } = await axios.post(
                //     "/api/users",
                //     {
                //         name: data.Name,
                //         email: data.Email,
                //         password: data.Password
                //     },
                //     config
                // );

                // setLoading(false);
                localStorage.setItem("userInfo", JSON.stringify(resData));
                // ✅ Redirect to login or home after successful registration

                navigate("/login");
            } catch (error) {
                setLoading(false);
                setError(error.response?.data?.message || "Registration failed. Please try again.");
            }

        }
    };

    return <MainScreen title="Register">

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

                    />
                </div>
                {/* Name Field */}
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        {...register('Name', { required: 'Name is required' })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.Name ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.Name && (
                        <p className="text-red-500 text-sm mt-1">{errors.Name.message}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('Email', { required: 'Email is required' })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.Email ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                        className={`w-full px-4 py-2 rounded-lg border ${errors.Password ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.Password && (
                        <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register('ConfirmPassword', {
                            required: 'Confirm password is required',
                        })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.ConfirmPassword ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.ConfirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.ConfirmPassword.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <input
                        type="submit"
                        value={loading ? "Registering.." : "Register"}
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
        {/* Redirect to Login */}

    </MainScreen>
};

export default RegisterScreen;


