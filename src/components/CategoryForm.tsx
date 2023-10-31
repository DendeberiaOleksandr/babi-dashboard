"use client";
import { Category, useSaveCategoryMutation } from "@/slices/categorySlice";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
};

function CategoryForm() {
  const [category, setCategory] = useState<Category>();
  const [saveCategory] = useSaveCategoryMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const handleOnSave: SubmitHandler<Inputs> = (data) => {
    saveCategory({
        name: data.name
    })
  };

  return (
    <form onSubmit={handleSubmit(handleOnSave)} className="rounded-md px-4 py-2 flex flex-1 flex-row bg-primary">
      <input {...register("name", {
        required: { value: true, message: 'Category name is required!' }
      })} className="px-4 py-2 bg-yellow" type="text" placeholder="Name" />
      <input
        className="transition-colors hover:text-primary hover:border-l-primary hover:bg-yellow duration-300 px-4 py-2 border-2 border-yellow text-yellow font-bold"
        type="submit"
        value="Save"
      />
    </form>
  );
}

export default CategoryForm;
