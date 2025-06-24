import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { noteCreateReducer, noteDeleteReducer, noteListReducer, noteUpdateReducer } from './reducers/noteReducer';
import { userLoginReducer } from './reducers/loginReducer';
import { searchReducer } from './reducers/searchReducer';
import { userUpdateReducer } from './reducers/userReducer';
import { userRegisterReducer } from './reducers/UserReducer/RegisterReducer';
import { otpVerifyReducer, userResendOtpReducer, userVerifyReducer } from './reducers/OtpReducer';

// Combine all reducers here
const rootReducer = combineReducers({
    noteList: noteListReducer,
    userLogin: userLoginReducer,
    noteCreate: noteCreateReducer,
    noteUpdate: noteUpdateReducer,
    noteDelete: noteDeleteReducer,
    searchQuery: searchReducer,
    userUpdate: userUpdateReducer,
    userRegister: userRegisterReducer,
    otpVerify: otpVerifyReducer,
    userVerify: userVerifyReducer,
    userResendOtp: userResendOtpReducer
});

// Load initial state from localStorage
const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const preloadedState = {
    userLogin: {
        userInfo: userInfoFromStorage,
        loading: false,
        error: null
    }
};

// ✅ Configure store with default middleware (which includes redux-thunk)
const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (defaultMiddleware) => defaultMiddleware(), // ← no import needed
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
