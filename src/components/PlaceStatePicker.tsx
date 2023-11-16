"use client";
import { placeStates } from "@/const/placeState";
import { useGetCategoriesQuery } from "@/slices/categorySlice";
import React, { useEffect, useState } from "react";
import { FaCircleDot } from "react-icons/fa6";

type Props = {
  selectedState: string;
  setSelectedState: (selectedState: string | undefined) => void;
  statesError?: string;
  setStatesError?: any;
  style?: string;
  borderStyle?: string;
  widthStyle?: string;
  dropdownStyle?: string;
  optionStyle?: string;
  selectedOptionStyle?: string;
  dotStyle?: string;
};

function PlaceStatePicker({
  selectedState,
  setSelectedState,
  statesError,
  setStatesError,
  style,
  borderStyle,
  widthStyle,
  dropdownStyle,
  optionStyle,
  selectedOptionStyle,
  dotStyle
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePlaceStateClick = (placeState: string) => {
    if (selectedState === placeState) {
        setSelectedState(undefined);
    } else {
        setSelectedState(placeState);
    }
  };

  return (
    <div className={`relative ${widthStyle ? widthStyle : 'w-[320px]'}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${statesError ? 'border-red-500 text-red-500' : `${borderStyle ? borderStyle : 'border-l-primary border-r-yellow border-t-yellow border-b-yellow'}`} ${style ? style : 'cursor-pointer border-2 text-primary w-full h-full flex items-center justify-center px-4 py-2 bg-yellow'}`}
      >
        Place State
      </div>
      {isOpen && placeStates && (
        <ul className={`absolute flex flex-col w-full z-30 ${dropdownStyle ? dropdownStyle : 'bg-primary'}`}>
          {placeStates.map((placeState, index) => (
            <li
              onClick={(e) => handlePlaceStateClick(placeState)}
              className={`${optionStyle ?? 'flex items-center gap-2 cursor-pointer hover:bg-secondary text-yellow font-semibold px-4 py-2'} ${
                selectedState === placeState && (selectedOptionStyle ?? "bg-secondary")
              }`}
              key={placeState}
            >
              { (selectedState === placeState) && (
                <label className={`${dotStyle ?? "text-yellow"}`}>
                  <FaCircleDot />
                </label>
              )}
              {placeState}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceStatePicker;
