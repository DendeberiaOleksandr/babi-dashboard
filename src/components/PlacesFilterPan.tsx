"use client";
import { useGetCategoriesQuery } from "@/slices/categorySlice";
import { PlaceCriteria, PlaceState } from "@/slices/placeSlice";
import React, { useState } from "react";

type Props = {
  placeCriteria: PlaceCriteria;
  setPlaceCriteria: (placeCriteria: PlaceCriteria) => void;
};

type KeyValue = {
  key: any;
  value: any;
};

type CriteriaTextInput = {
  placeholder: string;
  key: string;
};

const inputClass = "px-4 py-2 rounded-md shadow bg-white";

function PlacesFilterPan({ placeCriteria, setPlaceCriteria }: Props) {

  const [criteria, setCriteria] = useState<PlaceCriteria>(placeCriteria);

  const {
    data: categories,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery();

  const criteriaTextInputs: CriteriaTextInput[] = [
    {
      placeholder: "Id",
      key: "placeId",
    },
    {
      placeholder: "Route",
      key: "route",
    },
    {
      placeholder: "Locality",
      key: "locality",
    },
    {
      placeholder: "Country",
      key: "country",
    },
    {
      placeholder: "Postal Code",
      key: "postalCode",
    },
    {
      placeholder: "Administrative Area Level 1",
      key: "administrativeAreaLevel1",
    },
    {
      placeholder: "Administrative Area Level 2",
      key: "administrativeAreaLevel2",
    },
  ];

  const handleSearch = () => {
    setPlaceCriteria(criteria);
  };

  return (
    <form className="bg-primary rounded-md w-full px-4 py-2 flex flex-col gap-4">
      <div className="w-full grid grid-cols-4 gap-4">
        {categories && (
          <Select
            value={criteria.categoryId}
            defaultValue="category"
            defaultValueText="Category"
            valueKey="categoryId"
            values={categories.map((category) => ({
              key: category.id,
              value: category.name,
            }))}
          />
        )}

        <Select
          value={criteria.placeState}
          defaultValue="placeState"
          defaultValueText="Place State"
          valueKey="placeState"
          values={[
            {
              key: PlaceState.APPROVED + 1,
              value: PlaceState[PlaceState.APPROVED],
            },
            {
              key: PlaceState.HIDDEN + 1,
              value: PlaceState[PlaceState.HIDDEN],
            },
            {
              key: PlaceState.REVIEW + 1,
              value: String(PlaceState[PlaceState.REVIEW]),
            },
          ]}
        />

        {criteriaTextInputs.map((textInput) => (
          <input
            key={textInput.key}
            placeholder={textInput.placeholder}
            type="text"
            value={(criteria as any)[textInput.key] ?? ''}
            className={inputClass}
            onChange={(e) =>
              setCriteria({
                ...criteria,
                [textInput.key]: e.target.value,
              })
            }
          />
        ))}
      </div>

      <div className="grid grid-rows-1 grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="rounded-md bg-white px-4 rounded-b-none shadow text-gray-400 pb-1 border-b-gray-200 border-2">
            Adding Date From
          </label>
          <input
            onChange={e => setCriteria({
              ...criteria,
              addingDateFrom: new Date(e.target.value)
            })}
            type="datetime-local"
            className={`${inputClass} py-0 pb-1 rounded-t-none`}
          />
        </div>
        <div className="flex flex-col">
          <label className="rounded-md bg-white px-4 rounded-b-none shadow text-gray-400 pb-1 border-b-gray-200 border-2">
            Adding Date To
          </label>
          <input
          onChange={e => setCriteria({
            ...criteria,
            addingDateTo: new Date(e.target.value)
          })}
            type="datetime-local"
            className={`${inputClass} py-0 pb-1 rounded-t-none`}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        <input
          className={`px-4 py-2 rounded-md shadow bg-green-400 cursor-pointer hover:bg-green-500 duration-200 transition-colors text-white font-semibold`}
          type="button"
          value={"Search"}
          onClick={handleSearch}
        />
        <input
          className={`px-4 py-2 rounded-md shadow bg-red-400 cursor-pointer hover:bg-red-500 duration-200 transition-colors text-white font-semibold`}
          type="button"
          value={"Reset"}
          onClick={(e) => {
            const resetCriteria: PlaceCriteria = {
              page: 0,
              size: 25
            }
            setCriteria(resetCriteria);
            setPlaceCriteria(resetCriteria);
          }}
        />
      </div>
    </form>
  );

  type SelectProps = {
    value: any;
    defaultValue: string;
    defaultValueText: string;
    valueKey: string;
    values: any[];
  };

  function Select({
    value,
    defaultValue,
    defaultValueText,
    valueKey,
    values,
  }: SelectProps) {
    return (
      <select
        className={inputClass}
        value={value ? value : defaultValue}
        onChange={(e) => {
          const val = e.target.value;
          if (val === defaultValue) {
            setCriteria({
              ...criteria,
              [valueKey]: undefined,
            });
          } else {
            setCriteria({
              ...criteria,
              [valueKey]: +val,
            });
          }
        }}
      >
        <option value={defaultValue}>{defaultValueText}</option>
        {values &&
          values.map((v) => (
            <option key={v.key} value={v.key}>
              {v.value}
            </option>
          ))}
      </select>
    );
  }
}

export default PlacesFilterPan;
