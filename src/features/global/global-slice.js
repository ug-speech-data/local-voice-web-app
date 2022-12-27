import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        activeTopNavMenu: "home",
    },
    reducers: {
        setActiveNavMenu: (state, action) => {
            state.activeTopNavMenu = action.payload
        },
    },
});

export const { setActiveNavMenu } = globalSlice.actions;
export default globalSlice.reducer;
