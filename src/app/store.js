import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer, { apiSlice } from "../features/authentication/authentication-api-slice";

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware);
    },
});
