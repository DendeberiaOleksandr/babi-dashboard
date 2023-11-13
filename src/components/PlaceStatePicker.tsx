"use client";
import { useGetCategoriesQuery } from "@/slices/categorySlice";
import { PlaceState } from "@/slices/placeSlice";
import React, { useEffect, useState } from "react";
import { FaCircleDot } from "react-icons/fa6";

type Props = {
  selectedState?: PlaceState;
  setSelectedState: (selectedState: PlaceState | undefined) => void;
  statesError?: string;
  setStatesError?: any;
  style?: string;
  borderStyle?: string;
  widthStyle?: string;
  dropdownStyle?: string;
};

function PlaceStatePicker({
    selectedState,
    setSelectedState,
    statesError,
    setStatesError,
  style,
  borderStyle,
  widthStyle,
  dropdownStyle
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const placeStates: PlaceState[] = [
    PlaceState.APPROVED,
    PlaceState.HIDDEN,
    PlaceState.REVIEW
  ];

  const handlePlaceStateClick = (placeState: PlaceState) => {
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
              className={`flex items-center gap-2 cursor-pointer hover:bg-secondary text-yellow font-semibold px-4 py-2 ${
                selectedState === placeState && "bg-secondary"
              }`}
              key={placeState}
            >
              {selectedState === placeState && (
                <label className="text-yellow">
                  <FaCircleDot />
                </label>
              )}
              {PlaceState[placeState]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaceStatePicker;
