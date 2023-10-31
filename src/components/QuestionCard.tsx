"use client";
import { Category } from "@/slices/categorySlice";
import { Question, useEditQuestionMutation } from "@/slices/questionSlice";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineFileImage } from "react-icons/ai";
import { FaXmark } from "react-icons/fa6";
import { BsFillPencilFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import axios from "axios";

type Props = {
  question: Question;
  categories: Category[];
};

function QuestionCard({ question, categories }: Props) {
  const [isHover, setIsHover] = useState(false);
  const [updateCategories, setUpdateCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File>();
  const [text, setText] = useState<string>("");
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const [editQuestion] = useEditQuestionMutation();

  const handleCategoryClick = (category: Category) => {
    if (updateCategories.find((c) => c.id === category.id)) {
      setUpdateCategories(updateCategories.filter((c) => c.id !== category.id));
    } else {
      setUpdateCategories([...updateCategories, category]);
    }
  };

  const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (question) {
      setUpdateCategories(question.categories);
      setText(question.text);
    }
  }, [question]);

  useEffect(() => {
    if (
      question.text !== text ||
      !updateCategories.every((val, index, arr) =>
        question.categoriesId.includes(val.id)
      ) ||
      !question.categoriesId.every((val, index, arr) => updateCategories.map(c => c.id).includes(val))
      || updateCategories.length === 0 ||
      file
    ) {
      setIsUpdated(true);
    } else {
      setIsUpdated(false);
    }
  }, [file, text, updateCategories]);

  const cancelForm = () => {
    setUpdateCategories(question.categories);
    setFile(undefined);
    setText(question.text);
  };

  const handleUpdate = (id: number) => {
    if (isFormValid()) {
      const newQuestion = {...question};
      newQuestion.text = text;
      newQuestion.categoriesId = updateCategories.map(
        (category) => category.id
      );
      if (file) {
        const imageForm = new FormData();
        imageForm.append("file", file!);
        const user: any = session?.user;
        axios
          .post(process.env.NEXT_PUBLIC_API_URL + "/images", imageForm, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              newQuestion.iconId = res.data;
            } else {
              return;
            }
          });
      }

      editQuestion(newQuestion).then(() => cancelForm());
    }
  };

  const isFormValid = (): boolean => {
    return !(!text || /^\s*$/.test(text)) && updateCategories.length > 0;
  };

  return (
    <div className="flex flex-col items-center justify-start rounded-md px-2 py-6 shadow-secondary shadow-sm w-[420px]">
      <div className="relative w-full h-[196px]">
        {file && (
          <div
            onClick={() => setFile(undefined)}
            className="hover:bg-primary transition-colors duration-200 absolute z-20 p-2 cursor-pointer bg-thirdly rounded-full right-2 top-2 shadow-md"
          >
            <span className="text-white">
              <FaXmark />
            </span>
          </div>
        )}
        <Image
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          fill
          style={{ objectFit: "cover" }}
          alt={`img-${question.id}`}
          src={
            file
              ? URL.createObjectURL(file)
              : process.env.NEXT_PUBLIC_API_URL + `/images/${question.iconId}`
          }
        />
        <input
          onChange={(e) => handleChooseImage(e)}
          ref={imagePickerRef}
          type="file"
          className="hidden"
        />
        <div
          onClick={(e) => imagePickerRef?.current?.click()}
          className={`${
            isHover ? "inline-block" : "hidden"
          } z-10 cursor-pointer hover:inline-block flex flex-row items-center justify-center absolute bg-gray-300 border-2 rounded-md border-gray-600 opacity-60 left-0 right-0 bottom-0 top-0`}
        >
          <label className="cursor-pointer inline-block text-4xl top-[50%] left-[50%] absolute -translate-x-[50%] -translate-y-[50%]">
            <AiOutlineFileImage />
          </label>
        </div>
      </div>
      <div className="w-full mt-4 flex flex-col gap-2 items-center justify-center">
        <label className="px-4 py-2 bg-primary text-white rounded-sm font-semibold">
          ID: {question.id}
        </label>
        <input
          className="w-full border-2 border-primary px-4 py-2"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-2 mt-2">
        {categories.map((category) => (
          <label
            onClick={() => handleCategoryClick(category)}
            className={`flex flex-row items-center justify-center gap-2 text-sm px-4 py-2 ${
              updateCategories.find((c) => c.id === category.id)
                ? "bg-primary text-white font-semibold rounded-full"
                : "hover:bg-thirdly hover:text-white transition-colors duration-200 cursor-pointer rounded-full"
            }`}
            key={`${question.id}-${category.id}`}
          >
            #{category.name}
            {updateCategories.find((c) => c.id === category.id) && (
              <span className="cursor-pointer text-lg">
                <FaXmark />
              </span>
            )}
          </label>
        ))}
      </div>
      <div className="flex flex-row items-center mt-6 justify-end gap-4 w-full">
        <button
          onClick={() => handleUpdate(question.id)}
          disabled={!isUpdated}
          className={`cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 ${
            !isUpdated &&
            "bg-gray-400 cursor-default opacity-30 hover:bg-gray-400"
          }`}
        >
          Update
        </button>
        <button
          onClick={() => cancelForm()}
          disabled={!isUpdated}
          className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 ${
            !isUpdated &&
            "bg-gray-400 cursor-default opacity-30 hover:bg-gray-400"
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;
