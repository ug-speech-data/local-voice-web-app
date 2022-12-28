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

            getUserPermissions: builder.query({
                query() {
                    return `/auth/user-permissions/`;
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

            // Categories
            getCategories: builder.query({
                query() {
                    return `/categories/`;
                },
            }),

            putCategories: builder.mutation({
                query(body) {
                    return {
                        url: `/categories/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteCategories: builder.mutation({
                query(body) {
                    return {
                        url: `/categories/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // Groups
            getGroups: builder.query({
                query() {
                    return `/groups/`;
                },
            }),

            putGroups: builder.mutation({
                query(body) {
                    return {
                        url: `/groups/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteGroups: builder.mutation({
                query(body) {
                    return {
                        url: `/groups/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // Group Permission
            getGroupPermissions: builder.query({
                query(group_id = 1) {
                    return `/permissions/group/${group_id}`;
                },
            }),

            putGroupPermissions: builder.mutation({
                query({ group_id = 1, body }) {
                    return {
                        url: `/permissions/group/${group_id}/`,
                        method: 'POST',
                        body,
                }
            },
            }),

        };
    },
});

export const { useGetImageToValidateQuery,
    useValidateImageMutation,
    useGetAudioToValidateQuery,
    useValidateAudioMutation,
    useSubmitTranscriptionMutation,
    useGetUserPermissionsQuery,

    useLazyGetUserPermissionsQuery,

    // Categories
    useLazyGetCategoriesQuery,
    usePutCategoriesMutation,
    useDeleteCategoriesMutation,

    // Groups
    useLazyGetGroupsQuery,
    usePutGroupsMutation,
    useDeleteGroupsMutation,


    // Group Permission
    useLazyGetGroupPermissionsQuery,
    usePutGroupPermissionsMutation,
} = resourceApiSlice;