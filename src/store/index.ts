import { categorySlice } from "@/slices/categorySlice";
import { questionSlice } from "@/slices/questionSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        [categorySlice.reducerPath]: categorySlice.reducer,
        [questionSlice.reducerPath]: questionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(categorySlice.middleware)
    .concat(questionSlice.middleware)
})