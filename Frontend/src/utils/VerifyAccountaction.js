import axios from "axios";
import { USER_VERIFY_FAIL, USER_VERIFY_REQUEST, USER_VERIFY_SUCCESS } from "../constants/userConstants";

export const verifyAccount = (email, otp) => async (dispatch) => {
    try {
        dispatch({ type: USER_VERIFY_REQUEST });

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true, // Essential for cookies
            timeout: 10000
        };

        // Only send OTP - userId comes from cookie
        const { data } = await axios.post('/api/users/reset-password/verify-otp', { email, otp });
        if (!data.success) {
            throw new Error(data.message);
        }

        dispatch({ type: USER_VERIFY_SUCCESS, payload: data.message });
    } catch (error) {
        const errorMessage = error.response?.data?.message
            || error.message
            || "OTP verification failed";
        console.error("Verification failed:", error.response?.data || error.message);

        dispatch({
            type: USER_VERIFY_FAIL,
            payload: errorMessage,
        });
        throw error; // Important for handling in component
    }
};