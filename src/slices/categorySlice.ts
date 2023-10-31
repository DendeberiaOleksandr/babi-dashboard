import baseQuery from '@/baseQuery';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react';


export interface Category {
    id: number,
    name: string
}

export interface CategoryInitialState {
    categories: Category[]
}

const initialState: CategoryInitialState = {
    categories: []
}


export const categorySlice = createApi({
    reducerPath: 'category',
    baseQuery: baseQuery,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/categories',
            providesTags: (result, error, arg) =>
            result
            ? [...result.map(({ id }) => ({ type: 'Category' as const, id })), 'Category']
            : ['Category'],
        }),
        saveCategory: builder.mutation<Category, Omit<Category, 'id'>>({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Category']
        }),
        removeCategory: builder.mutation<Category, number>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Category', id:arg }]
        }),
        editCategory: builder.mutation<Category, Pick<Category, 'id'>>({
            query: (body) => ({
                url: `/categories/${body.id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Category', id: arg.id }]
        })
    })
})

export const { useGetCategoriesQuery, useSaveCategoryMutation, useRemoveCategoryMutation, useEditCategoryMutation } = categorySlice;