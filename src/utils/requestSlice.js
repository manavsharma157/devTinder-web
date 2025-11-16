// requestSlice.js

import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice ({
    name: "requests",
    initialState : [], // <--- THIS IS THE FIX
    reducers: {
        addRequests: (state, action) => action.payload,
        removeRequests: (state, action) => [], // Also good to reset to an empty array
        
    },
});

export const { addRequests, removeRequests } = requestSlice.actions;
export default requestSlice.reducer;