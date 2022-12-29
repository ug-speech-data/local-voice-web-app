import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        activeTopNavMenu: "home",
        groups: [],
    },
    reducers: {
        setActiveNavMenu: (state, action) => {
            state.activeTopNavMenu = action.payload
        },
        setGroups: (state, action) => {
            state.groups = action.payload
        },
    },
});

export const { setActiveNavMenu, setGroups } = globalSlice.actions;
export default globalSlice.reducer;
