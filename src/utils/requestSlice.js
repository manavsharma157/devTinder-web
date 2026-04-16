// requestSlice.js

import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice ({
    name: "requests",
    initialState : [],
    reducers: {
        addRequests: (state, action) => action.payload,
        removeRequests: (state, action) => [],
        
    },
});

export const { addRequests, removeRequests } = requestSlice.actions;
export default requestSlice.reducer;