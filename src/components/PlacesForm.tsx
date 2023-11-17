"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiFillFileImage } from "react-icons/ai";
import CategoryPicker from "./CategoryPicker";
import { useSession } from "next-auth/react";
import { FaXmark } from "react-icons/fa6";
import { Address, Place, useCreatePlaceMutation } from "@/slices/placeSlice";
import PlaceStatePicker from "./PlaceStatePicker";
import { usePlacesWidget } from "react-google-autocomplete";
import axios from "axios";
import { APPROVED } from "@/const/placeState";
import SearchAddress from "./SearchAddress";

type Inputs = {
  name: string;
  pageLink?: string;
  image: URL;
};

type Props = {
  handleClose: () => void;
};

type Image = {
  id: number;
  name: string;
};

function PlacesForm({ handleClose }: Props) {
  const addressRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<any | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categoriesError, setCategoriesError] = useState<string>("");

  const [selectedPlaceState, setSelectedPlaceState] =
    useState<string>(APPROVED);
  const [placeStatesError, setPlaceStatesError] = useState<string>("");

  const [images, setImages] = useState<Image[]>([]);
  const [imagesError, setImagesError] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [pageLink, setPageLink] = useState<string>("");

  const [place, setPlace] = useState<Place>({});

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const [address, setAddress] = useState<Address>({});
  const [addressError, setAddressError] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const [createPlace] = useCreatePlaceMutation();

  useEffect(() => {
    setPlace((prevState) => ({
      ...prevState,
      imagesId: images.map((image) => image.id),
    }));
  }, [images]);

  useEffect(() => {
    if (
      name &&
      place.imagesId &&
      place.imagesId.length > 0 &&
      selectedCategories &&
      selectedCategories.length > 0 &&
      address &&
      address.route &&
      address.latitude &&
      address.longitude
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    name,
    place.imagesId,
    selectedCategories,
    address,
    address.route,
    address.latitude,
    address.longitude,
  ]);

  useEffect(() => {
    if (!name) {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
  }, [name]);

  useEffect(() => {
    if (!place.imagesId || place.imagesId.length === 0) {
      setImagesError("At least one image is required");
    } else {
      setImagesError("");
    }
  }, [place.imagesId]);

  useEffect(() => {
    if (!selectedCategories || selectedCategories.length === 0) {
      setCategoriesError("At least one category is required");
    } else {
      setCategoriesError("");
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (!address || !address.route || !address.latitude || !address.longitude) {
      setAddressError("Address is required");
    } else {
      setAddressError("");
    }
  }, [address, address.route, address.latitude, address.longitude]);

  const handleOnSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createPlace({
      name: name,
      imagesId: place.imagesId,
      categoriesId: selectedCategories,
      pageLink: pageLink,
      address: address,
    }).then((res) => handleClose());
  };

  const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageForm = new FormData();
        imageForm.append("file", file!);
        const user: any = session?.user;
        axios
          .post(process.env.NEXT_PUBLIC_API_URL + "/images", imageForm, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setImages((prevState) => [
                ...prevState,
                {
                  id: res.data,
                  name: file.name,
                },
              ]);
            }
          });
      }
    }
  };

  return (
    <div className="flex">
      <form
        onSubmit={(e) => handleOnSave(e)}
        className="w-full px-4 pb-16 pt-6 flex flex-1 flex-col justify-start bg-primary rounded-l-md min-w-[640px] max-w-[640px]"
      >
        <span
          onClick={handleClose}
          className="cursor-pointer hover:bg-gray-200 transtion-colors duration-200 ml-auto bg-white rounded-full shadow w-[32px] h-[32px] flex justify-center items-center"
        >
          <FaXmark />
        </span>
        <input
          onChange={(e) => setName(e.currentTarget.value)}
          value={name}
          className={`${
            nameError && "border-2 border-red-500"
          } w-full px-4 py-2 mt-6 bg-white rounded-sm my-2 shadow`}
          type="text"
          placeholder="Name"
        />
        {nameError && <label className="my-1 text-red-500">{nameError}</label>}
        <input
          onChange={(e) => setPageLink(e.currentTarget.value)}
          value={pageLink}
          className={"w-full px-4 py-2 bg-white rounded-sm my-2 shadow"}
          type="text"
          placeholder="Page Link"
        />
        <input
          ref={hiddenFileInput}
          className="hidden"
          type="file"
          onChange={(e) => handleChooseImage(e)}
        />

        <SearchAddress
          onPlaceSelected={(place) => {
            place["address_components"].forEach((addressComponent: any): any => {
              const addressTypes = addressComponent.types;
              if (addressTypes.includes("street_number")) {
                setAddress(prevState => ({
                  ...prevState,
                  streetNumber: addressComponent["long_name"],
                }));
              } else if (addressTypes.includes("route")) {
                setAddress(prevState => ({
                  ...prevState,
                  route: addressComponent["long_name"],
                }));
              } else if (addressTypes.includes("locality")) {
                setAddress(prevState => ({
                  ...prevState,
                  locality: addressComponent["long_name"],
                }));
              } else if (addressTypes.includes("administrative_area_level_2")) {
                setAddress(prevState => ({
                  ...prevState,
                  administrativeAreaLevel2: addressComponent["long_name"],
                }));
              } else if (addressTypes.includes("administrative_area_level_1")) {
                setAddress(prevState => ({
                  ...prevState,
                  administrativeAreaLevel1: addressComponent["long_name"],
                }));
              } else if (addressTypes.includes("country")) {
                setAddress(prevState => ({
                  ...prevState,
                  country: addressComponent["long_name"],
                }));
              } else if (addressTypes.includes("postal_code")) {
                setAddress(prevState => ({
                  ...prevState,
                  postalCode: String(addressComponent["long_name"]),
                }));
              }
            });
            const location = place?.geometry?.location;
            if (location) {
              setAddress(prevState => ({
                ...prevState,
                latitude: location.lat(),
                longitude: location.lng(),
              }));
            }
          }}
          addressError={addressError}
        />

        {addressError && (
          <label className="my-1 text-red-500">{addressError}</label>
        )}

        <span
          onClick={() => hiddenFileInput?.current?.click()}
          className={`${
            imagesError && "border-red-500 text-red-500"
          } hover:bg-gray-200 w-full transition-colors duration-200 shadow cursor-pointer gap-2 flex rounded-sm px-4 py-2 bg-white flex-row items-center my-2`}
        >
          <AiFillFileImage />
          Add Image
        </span>

        {imagesError && (
          <label className="my-1 text-red-500">{imagesError}</label>
        )}

        {images && images.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative max-w-[146px] text-center bg-white shadow flex flex-col justify-center items-center px-4 py-2 rounded-md"
              >
                <label
                  onClick={() =>
                    setImages(images.filter((i) => i.id !== image.id))
                  }
                  className="hover:bg-gray-600 hover:shadow-md transition-colors duration-200 flex justify-center items-center rounded-full bg-black w-[24px] h-[24px] cursor-pointer text-white absolute right-2 top-2"
                >
                  <FaXmark />
                </label>
                <label className="pb-6 pt-2 text-4xl">
                  <AiFillFileImage />
                </label>
                <label className="text-xs">{image.name}</label>
              </div>
            ))}
          </div>
        )}

        <CategoryPicker
          dropdownStyle="bg-primary shadow"
          widthStyle="w-full"
          style="bg-white text-black rounded-sm my-2 px-4 py-2 cursor-pointer shadow hover:bg-gray-200 transition-colors duration-200 text-center"
          borderStyle="border-none"
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categoriesError={categoriesError}
          setCategoriesError={setCategoriesError}
        />

        {categoriesError && (
          <label className="my-1 text-red-500">{categoriesError}</label>
        )}

        <PlaceStatePicker
          dropdownStyle="bg-primary shadow"
          widthStyle="w-full"
          style="bg-white text-black rounded-sm my-2 px-4 py-2 cursor-pointer shadow hover:bg-gray-200 transition-colors duration-200 text-center"
          borderStyle="border-none"
          selectedState={selectedPlaceState}
          setSelectedState={(placeState) => {
            if (placeState) {
              setSelectedPlaceState(placeState);
            }
          }}
          statesError={placeStatesError}
          setStatesError={setPlaceStatesError}
        />

        <input
          disabled={!isFormValid}
          className={`${
            !isFormValid
              ? "cursor-default opacity-40"
              : "cursor-pointer hover:text-black hover:bg-white"
          } transition-color duration-300 px-4 py-2 border-2 border-white text-white bg-primary`}
          type="submit"
          value="Save"
        />
      </form>
    </div>
  );
}

export default PlacesForm;
