"use client";
import { useGetQuestionsQuery } from "@/slices/questionSlice";
import React from "react";
import QuestionCard from "./QuestionCard";
import { useGetCategoriesQuery } from "@/slices/categorySlice";

function QuestionsGrid() {
  const { data: questions, error: questionsError, isLoading: isQuestionsLoading } = useGetQuestionsQuery();
  const { data: categories, error: categoriesError, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  if (isCategoriesLoading || isQuestionsLoading) {
    return "Loading...";
  }

  return (
    <div className="mt-4 justify-center items-center flex flex-1 flex-row flex-wrap gap-4">
      {questions?.map(question => <QuestionCard categories={categories!} question={question} key={question.id}/>)}
    </div>
  );
}

export default QuestionsGrid;
