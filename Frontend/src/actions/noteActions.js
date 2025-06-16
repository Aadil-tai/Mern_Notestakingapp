import axios from "axios";
import {
    NOTE_LIST_FAIL,
    NOTE_LIST_REQUEST,
    NOTE_LIST_SUCCESS,
    NOTES_CREATE_FAIL,
    NOTES_CREATE_REQUEST,
    NOTES_CREATE_SUCCESS,
    NOTES_DELETE_FAIL,
    NOTES_DELETE_REQUEST,
    NOTES_DELETE_SUCCESS,
    NOTES_UPDATE_FAIL,
    NOTES_UPDATE_REQUEST,
    NOTES_UPDATE_SUCCESS
} from "../constants/NoteConstants";

export const listnotes = () => async (dispatch, getState) => {
    try {
        dispatch({ type: NOTE_LIST_REQUEST });
        const { userLogin, searchQuery } = getState();

        const { userInfo } = userLogin;

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };

        const { data } = await axios.get(
            `/api/notes?search=${encodeURIComponent(searchQuery || '')}`,
            config
        );


        console.log("Fetched notes:", data);

        dispatch({
            type: NOTE_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        dispatch({
            type: NOTE_LIST_FAIL,
            payload:
                error.response?.data?.message || error.message,
        });
    }
};

export const createNoteAction = (title, content, category) => async (dispatch, getState) => {
    try {
        dispatch({
            type: NOTES_CREATE_REQUEST
        });
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        };
        const { data } = await axios.post(
            '/api/notes/create',
            { title, content, category },
            config
        );

        dispatch({
            type: NOTES_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.message.data.message
                : error.message;
        dispatch({
            type: NOTES_CREATE_FAIL,
            payload: message,
        })
    }
};

export const updateNoteAction = (id, title, content, category) => async (dispatch, getState) => {
    try {
        dispatch({
            type: NOTES_UPDATE_REQUEST,
        })

        const {
            userLogin: { userInfo },
        } = getState();


        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        }

        const { data } = await axios.put(
            `/api/notes/${id}`,
            { title, content, category },
            config
        )
        dispatch({
            type: NOTES_UPDATE_SUCCESS,
            payload: data,
        })
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.message.data.message
                : error.message;
        dispatch({
            type: NOTES_UPDATE_FAIL,
            payload: message,
        })
    }
}

export const deleteNoteAction = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: NOTES_DELETE_REQUEST
        });

        const {
            userLogin: { userInfo },
        } = getState();


        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`,
            },
        }
        const { data } = await axios.delete(`/api/notes/${id}`, config);

        dispatch({
            type: NOTES_DELETE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.message.data.message
                : error.message;
        dispatch({
            type: NOTES_DELETE_FAIL,
            payload: message,
        })
    }
}


