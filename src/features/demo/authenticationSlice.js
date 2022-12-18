import { createSlice } from "@reduxjs/toolkit";

export const authenticationSlice = createSlice({
    name: "authentication",
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        }
    },
});

export const { increment } = authenticationSlice.actions;
export default authenticationSlice.reducer;

