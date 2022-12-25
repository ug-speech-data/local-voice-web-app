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
            getImageToValidate: builder.query({
                query(page = 1) {
                    return `/get-image-to-validate?page=${page}`;
                },
            }),

            getAudioToValidate: builder.query({
                query(id = -1) {
                    return `/get-audio-to-validate?offsetId=${id}`;
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

            submitTranscription: builder.mutation({
                query(body) {
                    return {
                        url: `/submit-transcription/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
        };
    },
});

export const { useGetImageToValidateQuery, useValidateImageMutation, useGetAudioToValidateQuery, useValidateAudioMutation, useSubmitTranscriptionMutation } = resourceApiSlice;