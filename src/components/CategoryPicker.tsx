"use client";
import { useGetCategoriesQuery } from "@/slices/categorySlice";
import React, { useEffect, useState } from "react";
import { FaCircleDot } from "react-icons/fa6";

type Props = {
  selectedCategories: number[];
  setSelectedCategories: any;
  categoriesError: string;
  setCategoriesError: any;
};

function CategoryPicker({
  selectedCategories,
  setSelectedCategories,
  categoriesError,
  setCategoriesError,
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
    <div className="relative w-[320px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${categoriesError ? 'border-red-500 text-red-500' : 'border-l-primary border-r-yellow border-t-yellow border-b-yellow'} cursor-pointer border-2 text-primary w-full h-full flex items-center justify-center px-4 py-2 bg-yellow`}
      >
        Category
      </div>
      {isOpen && categories && (
        <ul className="absolute flex flex-col w-full bg-primary z-50">
          {categories.map((category, index) => (
            <li
              onClick={(e) => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 cursor-pointer hover:bg-secondary text-yellow font-semibold px-4 py-2 ${
                selectedCategories.includes(category.id) && "bg-secondary"
              }`}
              key={category.id}
            >
              {selectedCategories?.includes(category.id) && (
                <label className="text-yellow">
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
