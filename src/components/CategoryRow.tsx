"use client";
import { Category, useEditCategoryMutation } from "@/slices/categorySlice";
import React, { useState } from "react";
import { FaPen, FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

type Props = {
  category: Category;
};

function CategoryRow({ category }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [newCategory, setNewCategory] = useState(category);
  const [editCategory] = useEditCategoryMutation();

  const onDecline = () => {
    setIsEdit(false);
    setNewCategory(category);
  };

  const onAccept = () => {
    if (newCategory && newCategory.name) {
        editCategory(newCategory)
    }
    setIsEdit(false);
  };

  return (
    <tr>
      <td className="p-[15px] border border-primary">{category.id}</td>
      <td className="p-[15px] border border-primary">
        {isEdit ? (
          <div className="flex flex-row items-center gap-4">
            <input
              onChange={(e) =>
                setNewCategory({
                  id: newCategory.id,
                  name: e.currentTarget.value,
                })
              }
              type="text"
              value={newCategory.name}
              className="bg-yellow py-2 px-4 border-2 border-primary"
            />
            <label
              onClick={() => onAccept()}
              className="text-white cursor-pointer p-2 rounded-full bg-primary"
            >
              <FaCheck />
            </label>
            <label
              onClick={() => onDecline()}
              className="text-white cursor-pointer p-2 rounded-full bg-primary"
            >
              <FaXmark />
            </label>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-4">
            {category.name}
            <label
              onClick={() => setIsEdit(true)}
              className="text-white cursor-pointer p-2 rounded-full bg-primary"
            >
              <FaPen />
            </label>
          </div>
        )}
      </td>
    </tr>
  );
}

export default CategoryRow;
