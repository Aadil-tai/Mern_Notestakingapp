const initialState = "";

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_SEARCH_QUERY":
            return action.payload;
        default:
            return state;
    }
};
