import { Question, QuestionUpdate } from "@/slices/questionSlice";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AiFillFileImage } from "react-icons/ai";
import CategoryPicker from "./CategoryPicker";
import axios from "axios";
import { useSession } from "next-auth/react";

type Props = {
  getQuestion: () => QuestionUpdate;
  setSelectedCategoriesId: (categoriesId: number[]) => void;
  setIconId: (iconId: number) => void;
  setText: (text: string) => void;
};

function QuestionTreeUpdateForm({
  getQuestion,
  setIconId,
  setSelectedCategoriesId,
  setText
}: Props) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [question, setQuestion] = useState<QuestionUpdate>();
  const { data: session, status } = useSession();

  useEffect(() => {
    setQuestion(getQuestion());
  }, [getQuestion]);

  const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const imageForm = new FormData();
      imageForm.append("file", event.target.files[0]!);
      const user: any = session?.user;
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/images", imageForm, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setIconId(res.data);
          }
        });
    }
  };

  return (
    <div className="flex flex-col px-4 py-2">
      <div className="relative h-[146px] w-full shadow-sm shadow-primary">
        <Image
          fill
          style={{ objectFit: "contain" }}
          alt={`question-image-${question?.id}`}
          src={`${api}/images/${question?.iconId}`}
        />
        <div
          onClick={() => hiddenFileInput?.current?.click()}
          className="opacity-0 hover:opacity-90 flex flex-col items-center justify-center border-gray-600 absolute top-0 bottom-0 right-0 left-0 z-50 bg-gray-400 w-full h-full"
        >
          <label className="text-white text-5xl">
            <AiFillFileImage />
          </label>
        </div>
        <input
          onChange={(e) => handleChooseImage(e)}
          className="hidden"
          type="file"
          ref={hiddenFileInput}
        />
      </div>
      <input
        className="mt-4 bg-secondary font-semibold text-gray-100 w-full shadow-sm shadow-primary px-4 py-2"
        value={question?.text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <CategoryPicker
          borderStyle="border-2 border-thirdly"
          style="bg-primary px-4 py-2 text-gray-100 text-center font-bold cursor-pointer"
          selectedCategories={question?.categoriesId!}
          setSelectedCategories={setSelectedCategoriesId}
        />
      </div>
    </div>
  );
}

export default QuestionTreeUpdateForm;
