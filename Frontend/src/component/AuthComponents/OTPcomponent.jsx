import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendOtp, verifyAccount } from '../../utils/userAction';

const OTPcomponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loading, error, success } = useSelector((state) => state.userVerify);
    const { loading: resendLoading, error: resendError, success: resendSuccess, message } =
        useSelector((state) => state.userResendOtp);

    useEffect(() => {
        if (success) {
            toast.success('Email verified successfully!');
            navigate('/login');
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, navigate]);

    useEffect(() => {
        if (resendSuccess) {
            toast.success(message || 'OTP resent successfully!');
        }
        if (resendError) {
            toast.error(resendError);
        }
    }, [resendSuccess, resendError, message]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, '');
        if (!value && e.nativeEvent.inputType === 'deleteContentBackward') {
            updateOtp(index, '');
            if (index > 0) inputRefs.current[index - 1].focus();
            return;
        }

        if (value) {
            updateOtp(index, value);
            if (index < 5) inputRefs.current[index + 1].focus();
        }
    };

    const updateOtp = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleResend = () => {
        if (!userId) return toast.error('User ID missing');
        dispatch(resendOtp(userId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.some((digit) => digit === '')) {
            return toast.error('Please enter all 6 digits');
        }
        setIsSubmitting(true);
        await dispatch(verifyAccount(otp.join(''), userId));
        setIsSubmitting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            >
                <h1 className="text-white text-2xl font-semibold text-center mb-4">
                    Email Verify OTP
                </h1>
                <p className="text-center mb-6 text-indigo-300">
                    Enter the 6-digit code sent to your email ID.
                </p>

                <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            ref={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            className="w-12 h-12 border rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    {loading || isSubmitting ? 'Verifying...' : 'Verify'}
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="mt-2 w-full text-sm text-indigo-300 hover:text-indigo-100 underline text-center"
                >
                    {resendLoading ? 'Resending...' : 'Resend OTP'}
                </button>
            </form>
        </div>
    );
};

export default OTPcomponent;
