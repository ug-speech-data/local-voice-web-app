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
                query(offset = 1) {
                    return `/get-image-to-validate?offset=${offset}`;
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
                    return `/categories?page_size=100`;
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

            // Users
            getUsers: builder.query({
                query(page = 1) {
                    return `/users/?page=${page}`;
                },
            }),

            putUsers: builder.mutation({
                query(body) {
                    return {
                        url: `/users/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteUsers: builder.mutation({
                query(body) {
                    return {
                        url: `/users/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),


            // Configurations
            getConfigurations: builder.query({
                query() {
                    return `/configurations/`;
                },
            }),

            putConfigurations: builder.mutation({
                query(body) {
                    return {
                        url: `/configurations/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            // Images
            getUploadedImages: builder.query({
                query() {
                    return `/images/`;
                },
            }),

            putImages: builder.mutation({
                query(body) {
                    return {
                        url: `/images/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteImages: builder.mutation({
                query(body) {
                    return {
                        url: `/images/`,
                        method: 'DELETE',
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

    // Users
    useLazyGetUsersQuery,
    usePutUsersMutation,
    useDeleteUsersMutation,

    // Configurations
    useLazyGetConfigurationsQuery,
    usePutConfigurationsMutation,

    // Images
    useLazyGetUploadedImagesQuery,
    useDeleteImagesMutation,
    usePutImagesMutation,

} = resourceApiSlice;