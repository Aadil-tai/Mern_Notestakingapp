import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { verifyAccount } from '../../utils/VerifyAccountaction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [email, setEmail] = useState(""); // Track entered email
    const [isSubmitting, setIsSubmitting] = useState(false);



    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    // Submit email
    const onSubmitEmail = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/api/users/reset-password/request", { email: data.email });

            if (response.data.success) {
                toast.success(response.data.message);
                setEmail(data.email); // Store email
                setStep(2);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Handle OTP input
    // Step 2: OTP Input Handler
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };

    // Verify OTP
    // Step 2: OTP Verify
    const onVerifyOtp = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }

        try {
            await dispatch(verifyAccount(email, enteredOtp));
            toast.success("OTP verified");

            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Submit new password
    const onSubmitNewPassword = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/api/users/reset-password", {
                email,
                otp: otp.join(''),
                newPassword: data.password,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                reset();
                navigate("/login")
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-400  px-4">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Step 1: Email */}
                {step === 1 && (
                    <form
                        onSubmit={handleSubmit(onSubmitEmail)}
                        className="bg-[#0c0f26] p-8 rounded-xl w-[300px] shadow-lg"
                    >
                        <h2 className="text-white text-lg font-semibold mb-2">Reset password</h2>
                        <p className="text-sm text-gray-300 mb-4">Enter your registered email address</p>

                        <div className="mb-4">
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email format',
                                    },
                                })}
                                placeholder="Email id"
                                className="w-full px-4 py-2 rounded-full bg-[#1c2039] text-white placeholder-gray-400 outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
                        >
                            Submit
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <div className="bg-[#0c0f26] p-8 rounded-xl  shadow-lg">
                        <h2 className="text-white text-lg font-semibold mb-2">Reset password OTP</h2>
                        <p className="text-sm text-gray-300 mb-4">Enter the 6-digit code sent to your email id.</p>

                        <div className="flex justify-between gap-2 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="w-10 h-10 text-center rounded-md bg-[#1c2039] text-white outline-none"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                />
                            ))}
                        </div>

                        <button
                            onClick={onVerifyOtp}
                            className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
                        >
                            Verify email
                        </button>
                    </div>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form
                        onSubmit={handleSubmit(onSubmitNewPassword)}
                        className="bg-[#0c0f26] p-8 rounded-xl w-[300px] shadow-lg"
                    >
                        <h2 className="text-white text-lg font-semibold mb-2">Set new password</h2>
                        <p className="text-sm text-gray-300 mb-4">Choose a strong new password.</p>

                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="New password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimum 6 characters required',
                                    },
                                })}
                                className="w-full px-4 py-2 rounded-full bg-[#1c2039] text-white placeholder-gray-400 outline-none"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Confirm password"
                                {...register('confirmPassword', {
                                    required: 'Confirm your password',
                                    validate: (value) =>
                                        value === getValues('password') || 'Passwords do not match',
                                })}
                                className="w-full px-4 py-2 rounded-full bg-[#1c2039] text-white placeholder-gray-400 outline-none"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold"
                        >
                            Reset password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
