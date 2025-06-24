import axios from "axios";
import {
    SEND_OTP_FAIL,
    SEND_OTP_REQUEST,
    SEND_OTP_SUCCESS,
    USER_OTP_RESEND_FAIL,
    USER_OTP_RESEND_REQUEST,
    USER_OTP_RESEND_SUCCESS,
} from "../constants/OtpConstants";

export const sendOtpToUser = (userId) => async (dispatch) => {
    try {
        dispatch({ type: SEND_OTP_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 10000, // 10s timeout
        };

        const { data } = await axios.post(
            "/api/users/send-verify-otp", // Corrected endpoint (same as resend?)
            { userId },
            config
        );

        if (!data.success) {
            throw new Error(data.message || "OTP send failed");
        }

        dispatch({ type: SEND_OTP_SUCCESS, payload: data.message });
    } catch (error) {
        const errorMessage = error.response?.data?.message
            || error.message
            || "OTP send failed";

        dispatch({
            type: SEND_OTP_FAIL,
            payload: errorMessage,
        });
    }
};

export const resendOtp = (userId) => async (dispatch) => {
    try {
        dispatch({ type: USER_OTP_RESEND_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            timeout: 10000, // 10s timeout
        };

        const { data } = await axios.post(
            '/api/users/send-verify-otp',
            { userId },
            config
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to resend OTP");
        }

        dispatch({
            type: USER_OTP_RESEND_SUCCESS,
            payload: data.message,
        });
    } catch (error) {
        const errorMessage = error.response?.data?.message
            || error.message
            || "Failed to resend OTP";

        dispatch({
            type: USER_OTP_RESEND_FAIL,
            payload: errorMessage,
        });
    }
};