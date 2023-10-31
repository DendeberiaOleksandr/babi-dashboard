import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CategoriesFilter } from "./CategoriesList";

type Props = {
  filter: CategoriesFilter;
  setFilter: any;
};

function CategoriesFilterPan({ filter, setFilter }: Props) {
  const setId = (value: string) => {
    if (!value) {
      setFilter({
        ...filter,
        id: "",
      });
    } else if(!isNaN(+value)) {
      setFilter({
        ...filter,
        id: +value,
      });
    }
  };

  return (
    <div className="flex flex-1 items-center flex-row my-4 gap-4">
      <div className="flex flex-row items-center px-4 py-2 border-2 border-primary">
        <input
          onChange={(e) =>
            setFilter({ ...filter, name: e.currentTarget.value })
          }
          value={filter.name}
          placeholder="Search by name"
        />
        <label className="text-primary">
          <AiOutlineSearch />
        </label>
      </div>
      <div className="flex flex-row items-center px-4 py-2 border-2 border-primary">
        <input
          value={filter.id}
          onChange={(e) => setId(e.currentTarget.value)}
          placeholder="Search by id"
        />
        <label className="text-primary">
          <AiOutlineSearch />
        </label>
      </div>
    </div>
  );
}

export default CategoriesFilterPan;
