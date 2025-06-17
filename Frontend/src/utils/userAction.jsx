import { NOTES_LIST_RESET, NOTES_UPDATE_FAIL } from "../constants/NoteConstants";
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS } from "../constants/userConstants";
import axios from 'axios';
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'USER_LOGOUT' });
    dispatch({ type: NOTES_LIST_RESET }); // 👈 Important: clears old notes
};

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const { data } = await axios.post('/api/users/login', { email, password });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
        dispatch({ type: USER_LOGIN_FAIL, payload: err.response?.data.message || err.message });
    }
};


export const updateProfile = (user) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: USER_UPDATE_REQUEST });

            const {
                userLogin: { userInfo },
            } = getState();



            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("email", user.email);
            if (user.password) formData.append("password", user.password);
            if (user.pic) formData.append("avatar", user.pic); // Must match multer field

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            };

            const { data } = await axios.put("/api/users/profile", formData, config);
            // const { data } = await axios.put("/api/users/profile", user, config);

            dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
            dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

            localStorage.setItem("userInfo", JSON.stringify(data));
        } catch (error) {
            console.error("Failed to update profile:", error);
            dispatch({
                type: USER_UPDATE_FAIL, // ⬅️ was NOTES_UPDATE_FAIL (incorrect)
                payload: error.response?.data?.message || error.message,
            });
        }
    };
};