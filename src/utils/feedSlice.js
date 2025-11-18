import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null, // Note: This should probably be [] (an empty array)
    reducers: {
        addFeed: (state, action) => action.payload,
        removeUserFromFeed: (state, action) => {
            // Check if state is actually an array before filtering
            if (!Array.isArray(state)) {
                return state; // Or return null, or [] depending on logic
            }
            
            // Filter the state and RETURN the new array
            const newFeed = state.filter((user) => user._id !== action.payload);
            return newFeed;
        }
    },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;