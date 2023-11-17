import { Address } from "@/slices/placeSlice";
import React, { useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

type Props = {
  onPlaceSelected: (place: any) => void;
  addressError: string;
  defaultValue?: string;
};

function SearchAddress({ onPlaceSelected, addressError, defaultValue }: Props) {
  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: onPlaceSelected,
    options: {
      fields: ["address_components", "geometry", "icon", "name"],
      types: ["street_address", "route"],
    },
  });

  return (
    <input
      value={defaultValue}
      className={`${
        addressError && "border-2 border-red-500"
      } w-full px-4 py-2 mt-6 bg-white rounded-sm my-2 shadow`}
      ref={ref}
      type="text"
      placeholder="Address"
    />
  );
}

export default SearchAddress;
