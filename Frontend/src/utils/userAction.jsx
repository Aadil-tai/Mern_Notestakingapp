import { NOTES_LIST_RESET, NOTES_UPDATE_FAIL } from "../constants/NoteConstants";
import { SEND_OTP_FAIL, SEND_OTP_REQUEST, SEND_OTP_SUCCESS } from "../constants/OtpConstants";
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS } from "../constants/userConstants";
import axios from 'axios';
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'USER_LOGOUT' });
    dispatch({ type: NOTES_LIST_RESET }); // 👈 Important: clears old notes
};


export const registerUser = (formData) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        };

        const { data } = await axios.post("/api/users", formData, config);
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });
        // ✅ Send OTP after registration
        dispatch({ type: SEND_OTP_REQUEST });

        const otpRes = await axios.post('/api/users/send-verify-otp', {
            userId: data._id,
        },
            {
                withCredentials: true,
            });
        dispatch({ type: SEND_OTP_SUCCESS, payload: otpRes.data.message });


        // ✅ 3. Let frontend redirect to OTP screen manually
        return data._id;


    } catch (error) {
        const message = error.response?.data?.message || 'Something went wrong';

        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response?.data?.message ||
                "Registration failed. Please try again.",
        });

        dispatch({
            type: SEND_OTP_FAIL,
            payload: message,
        });
        throw new Error(message);
    }
};


export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // crucial to send HttpOnly cookie
        };

        const { data } = await axios.post(
            "/api/users/login",
            { email, password },
            config
        );

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        // 🚫 No localStorage here at all
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response?.data?.message || "Login failed. Please try again.",
        });
    }
};


export const updateProfile = (userData) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const formData = new FormData();
        formData.append("name", userData.name);
        formData.append("email", userData.email);

        if (userData.password) {
            formData.append("password", userData.password);
        }

        if (userData.pic instanceof File) {
            formData.append("avatar", userData.pic);
        }

        const config = {
            headers: {
                // "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put("/api/users/profile", formData, config);

        // Dispatch success actions
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        // Update local storage
        localStorage.setItem("userInfo", JSON.stringify(data));

        // Return the data for potential .unwrap() usage
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "Profile update failed";

        dispatch({
            type: USER_UPDATE_FAIL,
            payload: errorMessage,
        });

        // Throw error for .unwrap() to catch
        throw new Error(errorMessage);
    }
};