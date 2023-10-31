"use client";
import {
  Category,
  useGetCategoriesQuery,
  useSaveCategoryMutation,
} from "@/slices/categorySlice";
import { Question, useSaveQuestionMutation } from "@/slices/questionSlice";
import React, { FormEvent, use, useRef, useState } from "react";
import { AiFillFileImage } from "react-icons/ai";
import CategoryPicker from "./CategoryPicker";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";

type Inputs = {
  text: string;
  image: URL;
};

function QuestionForm() {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categoriesError, setCategoriesError] = useState<string>('');

  const [fileError, setFileError] = useState<string>('');
  const [file, setFile] = useState<File>();

  const [textError, setTextError] = useState<string>('');
  const [text, setText] = useState<string>('');

  const [question, setQuestion] = useState<Question>();
  const [saveQuestion] = useSaveQuestionMutation();

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const { data: session, status } = useSession()

  const handleOnSave = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if(!text) {
      setTextError('Text is required')
    }

    if(!selectedCategories || selectedCategories.length === 0) {
      setCategoriesError('At least one category is required')
    }

    if(!file) {
      setFileError('Image is required')
    }

    if(textError || categoriesError || fileError) {
      return;
    }

    const imageForm = new FormData();
    imageForm.append('file', file!);
    const user: any = session?.user
    axios.post(process.env.NEXT_PUBLIC_API_URL + '/images', imageForm, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    }).then(res => {
      if(res.status === 200) {
        saveQuestion({
          text: text,
          iconId: res.data,
          categoriesId: selectedCategories
        })
      }
    })


  };
  const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-1 flex-row">
      <form
        onSubmit={e => handleOnSave(e)}
        className="rounded-md px-4 py-2 flex flex-1 flex-row bg-primary"
      >
        <input
          onChange={e => setText(e.currentTarget.value)}
          value={text}
          className={`${textError && 'border-2 border-red-500'} w-[520px] px-4 py-2 bg-yellow`}
          type="text"
          placeholder="Text"
        />
        <input
          ref={hiddenFileInput}
          className="hidden"
          type="file"
          onChange={(e) => handleChooseImage(e)}
        />
        <span
          onClick={() => hiddenFileInput?.current?.click()}
          className={`${fileError ? 'border-red-500 text-red-500' : 'border-t-yellow border-b-yellow border-l-primary border-r-yellow'} cursor-pointer w-[160px] gap-2 flex border-2 px-4 py-2 bg-yellow text-primary flex-row items-center`}
        >
          <AiFillFileImage />
          Image
        </span>

        <CategoryPicker
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categoriesError={categoriesError}
          setCategoriesError={setCategoriesError}
        />

        <input
          className="cursor-pointer transition-colors hover:text-primary hover:border-l-primary hover:bg-yellow duration-300 px-4 py-2 border-2 border-yellow text-yellow font-bold"
          type="submit"
          value="Save"
        />
      </form>
    </div>
  );
}

export default QuestionForm;
