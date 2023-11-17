"use client";
import { Category, useGetCategoriesQuery } from "@/slices/categorySlice";
import React, { useEffect, useState } from "react";
import NoDataFound from "./NoDataFound";
import CategoryRow from "./CategoryRow";

export type CategoriesFilter = {
  id?: number;
  name?: string;
};

type Props = {
  filter: CategoriesFilter;
  setFilter: any;
};

function CategoriesList({ filter, setFilter }: Props) {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>();

  useEffect(() => {
    if (!isLoading && categories) {
      setFilteredCategories(
        categories.filter((category) => {
          let isMatch = true;

          if (filter.id) {
            isMatch = false;
            if (filter.id === category.id) {
              isMatch = true;
            }
          }

          if (filter.name) {
            isMatch = false;
            if (category.name.includes(filter.name)) {
              isMatch = true;
            }
          }

          return isMatch;
        })
      );
    }
  }, [categories, filter, isLoading]);

  if (!isLoading && !categories) {
    return <NoDataFound />;
  }

  const thClass = "p-[15px] border border-primary";

  return (
    <div className="w-full h-[750px] overflow-y-auto">
      <table className="w-full h-vh text-lef border-collapse">
        <thead>
          <tr>
            <th className={thClass}>Id</th>
            <th className={thClass}>Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories?.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriesList;
