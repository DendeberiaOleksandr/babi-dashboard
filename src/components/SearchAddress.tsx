import { Address } from "@/slices/placeSlice";
import React, { useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

type Props = {
  onPlaceSelected: (place: any) => void;
  addressError: string;
};

function SearchAddress({ onPlaceSelected, addressError }: Props) {
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
      className={`${
        addressError && "border-2 border-red-500"
      } w-full px-4 py-2 bg-white rounded-md shadow-sm`}
      ref={ref}
      type="text"
      placeholder="Address"
    />
  );
}

export default SearchAddress;
