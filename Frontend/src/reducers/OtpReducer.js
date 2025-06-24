import { USER_OTP_RESEND_FAIL, USER_OTP_RESEND_REQUEST, USER_OTP_RESEND_SUCCESS, VERIFY_OTP_FAIL, VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS } from "../constants/OtpConstants";
import { USER_VERIFY_FAIL, USER_VERIFY_REQUEST, USER_VERIFY_SUCCESS } from "../constants/userConstants";

export const otpVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case VERIFY_OTP_REQUEST:
            return { loading: true };
        case VERIFY_OTP_SUCCESS:
            return { loading: false, success: true, message: action.payload };
        case VERIFY_OTP_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};


export const userVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_VERIFY_REQUEST:
            return { loading: true };
        case USER_VERIFY_SUCCESS:
            return { loading: false, success: true, message: action.payload };
        case USER_VERIFY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userResendOtpReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_OTP_RESEND_REQUEST:
            return { loading: true };
        case USER_OTP_RESEND_SUCCESS:
            return { loading: false, success: true, message: action.payload };
        case USER_OTP_RESEND_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
