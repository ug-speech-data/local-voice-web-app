import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        activeTopNavMenu: "home",
        groups: [],
        configurations: null,
        balance: null,
    },
    reducers: {
        setActiveNavMenu: (state, action) => {
            state.activeTopNavMenu = action.payload
        },
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        setConfigurations: (state, action) => {
            state.configurations = action.payload
        },
        setBalance: (state, action) => {
            state.balance = action.payload
        },
    },
});

export const { setActiveNavMenu, setGroups, setConfigurations, setBalance } = globalSlice.actions;
export default globalSlice.reducer;
