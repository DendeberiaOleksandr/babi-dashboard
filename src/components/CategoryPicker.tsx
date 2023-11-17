"use client";
import { useGetCategoriesQuery } from "@/slices/categorySlice";
import React, { useEffect, useState } from "react";
import { FaCircleDot } from "react-icons/fa6";

type Props = {
  selectedCategories: number[];
  setSelectedCategories: (categoriesId: number[]) => void;
  categoriesError?: string;
  setCategoriesError?: any;
  style?: string;
  borderStyle?: string;
  widthStyle?: string;
  dropdownStyle?: string;
  optionStyle?: string;
  selectedOptionStyle?: string;
  dotStyle?: string;
};

function CategoryPicker({
  selectedCategories,
  setSelectedCategories,
  categoriesError,
  setCategoriesError,
  style,
  borderStyle,
  widthStyle,
  dropdownStyle,
  optionStyle,
  selectedOptionStyle,
  dotStyle
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  const handleCategoryClick = (id: number) => {
    if (selectedCategories?.includes(id)) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== id)
      );
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <div className={`relative ${widthStyle ? widthStyle : 'w-[320px]'}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${categoriesError ? 'border-red-500 text-red-500' : `${borderStyle ? borderStyle : 'border-l-primary border-r-yellow border-t-yellow border-b-yellow'}`} ${style ? style : 'cursor-pointer border-2 text-primary w-full h-full flex items-center justify-center px-4 py-2 bg-yellow'}`}
      >
        Category
      </div>
      {isOpen && categories && (
        <ul className={`overflow-y-auto absolute flex flex-col w-full z-50 ${dropdownStyle ? dropdownStyle : 'bg-primary'}`}>
          {categories.map((category, index) => (
            <li
              onClick={(e) => handleCategoryClick(category.id)}
              className={`${optionStyle ?? 'flex items-center gap-2 cursor-pointer hover:bg-secondary text-yellow font-semibold px-4 py-2'} ${
                selectedCategories.includes(category.id) && (selectedOptionStyle ?? "bg-secondary")
              }`}
              key={category.id}
            >
              {selectedCategories?.includes(category.id) && (
                <label className={`${dotStyle ?? 'text-yellow'}`}>
                  <FaCircleDot />
                </label>
              )}
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryPicker;
