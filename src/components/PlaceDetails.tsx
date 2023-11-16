"use client";
import { Place } from "@/slices/placeSlice";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Image } from "next/dist/client/image-component";
import { AiFillFileImage } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Category } from "@/slices/categorySlice";
import { TbPointFilled } from "react-icons/tb";
import CategoryPicker from "./CategoryPicker";
import PlaceStatePicker from "./PlaceStatePicker";

type Props = {
  place: Place;
  onBackClick: () => void;
  categories: Category[];
};

function PlaceDetails({ place, onBackClick, categories }: Props) {
  const { data: session, status } = useSession();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [newPlace, setNewPlace] = useState<Place>();

  useEffect(() => {
    setNewPlace(place);
  }, [place]);

  const handleChooseImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageId: number
  ) => {
    if (e.target.files) {
      const imageForm = new FormData();
      imageForm.append("file", e.target.files[0]!);
      const user: any = session?.user;
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/images", imageForm, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setIsUpdated(true);
            setNewPlace((prevState) => ({
              ...prevState,
              imagesId: prevState?.imagesId
                ?.filter((img) => img !== imageId)
                .concat(res.data),
            }));
          }
        });
    }
  };

  const handleReset = () => {
    setNewPlace(place);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {};

  return (
    <div className="w-full flex flex-col h-full">
      <label
        onClick={() => onBackClick()}
        className="bg-primary cursor-pointer hover:bg-secondary text-white rounded-full max-w-[42px] max-h-[42px] min-w-[42px] min-h-[42px] flex justify-center items-center"
      >
        <IoArrowBack />
      </label>

      {newPlace && (
        <div className="mt-24 mx-auto w-[960px]">
          <div className="grid grid-cols-4 gap-4 w-full mx-auto bg-gray-100 rounded-md px-4 py-8 shadow">
            {newPlace.imagesId?.map((imageId) => (
              <div className="relative h-[186px] w-full z-10">
                <Image
                  style={{
                    objectFit: "contain",
                  }}
                  alt={"" + imageId}
                  fill
                  src={`${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`}
                />

                <div
                  onClick={() => hiddenFileInput?.current?.click()}
                  className="cursor-pointer opacity-0 hover:opacity-90 flex flex-col items-center justify-center border-gray-300 absolute top-0 bottom-0 right-0 left-0 z-50 bg-gray-400 w-full h-full"
                >
                  <label className="text-white text-5xl">
                    <AiFillFileImage />
                  </label>
                </div>
                <input
                  onChange={(e) => handleChooseImage(e, imageId)}
                  className="hidden"
                  type="file"
                  ref={hiddenFileInput}
                />
              </div>
            ))}
          </div>

          <div className="w-full mt-6 bg-gray-100 px-4 py-2 rounded-md flex flex-col">
            <div className="grid grid-cols-2 my-4">
              <div className="flex flex-row justify-center items-center gap-2">
                <CategoryPicker
                  dotStyle="text-gray-400"
                  selectedOptionStyle="bg-gray-300"
                  optionStyle="flex flex-row gap-2 items-center text-black px-4 py-2 cursor-pointer hover:bg-gray-200 duration-100 transition-colors"
                  style="px-4 py-2 bg-white cursor-pointer shadow-sm"
                  dropdownStyle="bg-gray-50 text-black shadow-sm"
                  selectedCategories={newPlace.categoriesId!}
                  setSelectedCategories={(selectedCategories) => {
                    setNewPlace((prevState) => ({
                      ...prevState,
                      categoriesId: selectedCategories,
                    }));
                  }}
                />
              </div>
              {newPlace.placeState && (
                <PlaceStatePicker
                  dotStyle="text-gray-400"
                  selectedOptionStyle="bg-gray-300"
                  optionStyle="flex flex-row gap-2 items-center text-black px-4 py-2 cursor-pointer hover:bg-gray-200 duration-100 transition-colors"
                  style="px-4 py-2 bg-white cursor-pointer shadow-sm"
                  dropdownStyle="bg-gray-50 text-black shadow-sm"
                  setSelectedState={(placeState) => {
                    const ps = placeState ?? place.placeState;
                    setNewPlace((prevState) => ({
                      ...prevState,
                      placeState: ps,
                    }));
                  }}
                  selectedState={newPlace.placeState}
                />
              )}
            </div>
          </div>

          <div className="flex flex-row justify-start gap-4 mt-12">
            <button className="px-4 py-2 bg-green-400 hover:bg-green-500 transition-colors duration-200 shadow-md rounded-md text-white text-xl">
              Update
            </button>
            <button
              onClick={() => handleReset()}
              className="px-4 py-2 bg-red-400 hover:bg-red-500 transition-colors duration-200 shadow-md rounded-md text-white text-xl"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaceDetails;
