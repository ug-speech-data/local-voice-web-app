import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const resourceApiSlice = createApi({
    reducerPath: 'resources-api',
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

            getAudiosToValidate: builder.query({
                query(page = 1) {
                    return `/get-audios-to-validate?page=${page}`;
                },
            }),
            validateImage: builder.mutation({
                query(body) {
                    return {
                        url: `/validate-image/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            validateAudio: builder.mutation({
                query(body) {
                    return {
                        url: `/validate-audio/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
        };
    },
});

export const { useGetImagesToValidateQuery, useValidateImageMutation, useGetAudiosToValidateQuery, useValidateAudioMutation } = resourceApiSlice;