import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const resourceApiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders(headers) {
            headers.set('Authorization', `Token ${localStorage.getItem('token')}`);
            return headers;
        },
    }),
    endpoints(builder) {
        return {
            getImagesToValidate: builder.query({
                query(page = 1) {
                    return `/get-images-to-validate?page=${page}`;
                },
            }),

        };
    },
});

export const { useGetImagesToValidateQuery } = resourceApiSlice;