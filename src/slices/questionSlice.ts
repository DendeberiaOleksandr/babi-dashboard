import baseQuery from "@/baseQuery";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { Category } from "./categorySlice";

export interface Question {
  id: number;
  text: string;
  iconId: number;
  categories: Category[];
  categoriesId: number[];
  previousQuestionsId: number[];
  previousQuestions: Question[];
  x: number;
  y: number;
}

export interface QuestionUpdate {
  id: number;
  text: string;
  iconId: number;
  categories: Category[];
  categoriesId: number[];
  previousQuestionsId: number[];
  previousQuestions: Question[];
  x: number;
  y: number;
};

export interface QuestionSave {
  text: string;
  iconId: number;
  categoriesId: number[];
}

export interface QuestionInitialState {
  questions: Question[];
}

const initialState: QuestionInitialState = {
  questions: [],
};

export const questionSlice = createApi({
  reducerPath: "question",
  baseQuery: baseQuery,
  tagTypes: ["Question", "Category"],
  endpoints: (builder) => ({
    getQuestions: builder.query<Question[], void>({
      query: () => "/questions",
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Question" as const, id })),
              "Question",
            ]
          : ["Question"],
    }),
    saveQuestion: builder.mutation<number, QuestionSave>({
      query: (body) => ({
        url: "/questions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Question"],
    }),
    removeQuestion: builder.mutation<Question, number>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Question", id: arg }],
    }),
    editQuestion: builder.mutation<Question, Question>({
      query: (body) => ({
        url: `/questions/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Question", id: arg.id },
      ],
    }),
    updateQuestions: builder.mutation<number[], Question[]>({
      query: (questions) => ({
        url: `/questions`,
        method: "PUT",
        body: questions,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.map((question) => ({ type: "Question", id: question.id })),
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useSaveQuestionMutation,
  useRemoveQuestionMutation,
  useEditQuestionMutation,
  useUpdateQuestionsMutation,
} = questionSlice;
