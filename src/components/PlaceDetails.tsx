"use client";
import { Address, Place, useUpdatePlaceMutation } from "@/slices/placeSlice";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Image } from "next/dist/client/image-component";
import { AiFillFileImage } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { Category } from "@/slices/categorySlice";
import CategoryPicker from "./CategoryPicker";
import PlaceStatePicker from "./PlaceStatePicker";
import SearchAddress from "./SearchAddress";
import { uploadImage } from "@/service/image.service";
import { FaTrash } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";

type Props = {
  place: Place;
  onBackClick: () => void;
  categories: Category[];
};

function PlaceDetails({ place, onBackClick, categories }: Props) {
  const [address, setAddress] = useState<Address>();
  const [addressError, setAddressError] = useState<string>("");
  const { data: session, status } = useSession();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const addImageRef = useRef<HTMLInputElement>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [newPlace, setNewPlace] = useState<Place>();
  const [updatePlace] = useUpdatePlaceMutation();
  const [lastChangedImageId, setLastChangedImageId] = useState<number>();

  useEffect(() => {
    setNewPlace(place);
  }, [place]);

  useEffect(() => {
    if (address) {
      setNewPlace((prevState) => ({
        ...prevState,
        address: address,
      }));
    }
  }, [address]);

  const handleChooseImage = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const user: any = session?.user;
      uploadImage(e.target.files[0], user).then((res) => {
        setIsUpdated(true);
        let newImagesId = [...newPlace?.imagesId!, res];
        if (lastChangedImageId) {
          newImagesId = newImagesId.filter((id) => id !== lastChangedImageId);
          setLastChangedImageId(undefined);
        }
        setNewPlace((prevState) => ({
          ...prevState,
          imagesId: newImagesId,
        }));
      });
    }
  };

  const handleReset = () => {
    setNewPlace(place);
  };

  const handleUpdate = () => {
    if (newPlace) {
      updatePlace(newPlace)
        .then((res) => {})
        .finally(() => onBackClick());
    }
  };

  const handleRemoveImage = (imageId: number) => {
    if (newPlace?.imagesId && newPlace.imagesId.length > 1) {
      setNewPlace((prevState) => ({
        ...prevState,
        imagesId: newPlace.imagesId!.filter((iId) => imageId !== iId),
      }));
    }
  };

  return (
    <div className="w-full flex flex-col">
      <label
        onClick={() => onBackClick()}
        className="bg-primary cursor-pointer hover:bg-secondary text-white rounded-full max-w-[42px] max-h-[42px] min-w-[42px] min-h-[42px] flex justify-center items-center"
      >
        <IoArrowBack />
      </label>

      {newPlace && (
        <div className="mt-12 mx-auto w-[1560px]">
          <div className="flex flex-row gap-4 w-full mx-auto overflow-x-auto bg-gray-100 rounded-md px-4 py-8 shadow">
            <div className="h-[186px] w-[178px] bg-gray-200 shadow flex flex-col justify-center items-center">
              <label
                onClick={() => addImageRef.current?.click()}
                className="cursor-pointer bg-gray-400 hover:bg-gray-300 duration-200 transition-colors text-white rounded-full text-3xl w-[72px] h-[72px] flex flex-col justify-center items-center"
              >
                <LuImagePlus />
              </label>

              <input
                onChange={(e) => handleChooseImage(e)}
                className="hidden"
                type="file"
                ref={addImageRef}
              />
            </div>

            {newPlace.imagesId?.map((imageId) => (
              <div
                key={imageId}
                className="relative h-[186px] min-w-[178px] z-10"
              >
                <Image
                  style={{
                    objectFit: "contain",
                  }}
                  alt={"" + imageId}
                  fill
                  src={`${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`}
                />

                <div className="opacity-0 hover:opacity-100 z-40 flex flex-row gap-4 items-center justify-center absolute top-0 bottom-0 right-0 left-0 w-full h-full">
                  <label
                    onClick={() => {
                      setLastChangedImageId(imageId);
                      hiddenFileInput?.current?.click();
                    }}
                    className="z-50 flex flex-col items-center justify-center shadow cursor-pointer text-white w-[42px] h-[42px] text-2xl rounded-full bg-primary"
                  >
                    <AiFillFileImage />
                  </label>

                  {newPlace?.imagesId?.length! > 1 && (
                    <label
                      onClick={() => handleRemoveImage(imageId)}
                      className="flex flex-col items-center justify-center shadow cursor-pointer text-white w-[42px] h-[42px] text-2xl rounded-full bg-primary"
                    >
                      <FaTrash />
                    </label>
                  )}
                </div>
                <input
                  onChange={(e) => handleChooseImage(e)}
                  className="hidden"
                  type="file"
                  ref={hiddenFileInput}
                />
              </div>
            ))}
          </div>

          <div className="w-full mt-6 bg-gray-100 px-4 py-2 rounded-md flex flex-col">
            <div className="grid grid-cols-4 gap-4 my-4 w-full">
              <div className="w-full flex flex-col gap-2 items-start">
                <label>Id:</label>

                <input
                  disabled
                  placeholder="Id"
                  value={newPlace.id}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Adding Date:</label>

                <input
                  disabled
                  placeholder="Adding Date"
                  value={String(newPlace.addingDate)}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Name:</label>
                <input
                  placeholder="Name"
                  onChange={(e) =>
                    setNewPlace((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }))
                  }
                  value={newPlace.name}
                  type="text"
                  className="w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Category:</label>

                <CategoryPicker
                  widthStyle="relative w-full"
                  dotStyle="text-gray-400"
                  selectedOptionStyle="bg-gray-300"
                  optionStyle="flex flex-row gap-2 items-center text-black px-4 py-2 cursor-pointer hover:bg-gray-200 duration-100 transition-colors"
                  style="px-4 py-2 bg-white cursor-pointer shadow-sm"
                  dropdownStyle="overflow-y-auto max-h-[240px] bg-gray-100 text-black shadow-md"
                  selectedCategories={newPlace.categoriesId!}
                  setSelectedCategories={(selectedCategories) => {
                    setNewPlace((prevState) => ({
                      ...prevState,
                      categoriesId: selectedCategories,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 my-4 w-full">
              <div className="w-full flex flex-col gap-2 items-start">
                <label>Address:</label>

                <SearchAddress
                  onPlaceSelected={(place) => {
                    place["address_components"].forEach(
                      (addressComponent: any): any => {
                        const addressTypes = addressComponent.types;
                        if (addressTypes.includes("street_number")) {
                          setAddress((prevState) => ({
                            ...prevState,
                            streetNumber: addressComponent["long_name"],
                          }));
                        } else if (addressTypes.includes("route")) {
                          setAddress((prevState) => ({
                            ...prevState,
                            route: addressComponent["long_name"],
                          }));
                        } else if (addressTypes.includes("locality")) {
                          setAddress((prevState) => ({
                            ...prevState,
                            locality: addressComponent["long_name"],
                          }));
                        } else if (
                          addressTypes.includes("administrative_area_level_2")
                        ) {
                          setAddress((prevState) => ({
                            ...prevState,
                            administrativeAreaLevel2:
                              addressComponent["long_name"],
                          }));
                        } else if (
                          addressTypes.includes("administrative_area_level_1")
                        ) {
                          setAddress((prevState) => ({
                            ...prevState,
                            administrativeAreaLevel1:
                              addressComponent["long_name"],
                          }));
                        } else if (addressTypes.includes("country")) {
                          setAddress((prevState) => ({
                            ...prevState,
                            country: addressComponent["long_name"],
                          }));
                        } else if (addressTypes.includes("postal_code")) {
                          setAddress((prevState) => ({
                            ...prevState,
                            postalCode: String(addressComponent["long_name"]),
                          }));
                        }
                      }
                    );
                    const location = place?.geometry?.location;
                    if (location) {
                      setAddress((prevState) => ({
                        ...prevState,
                        latitude: location.lat(),
                        longitude: location.lng(),
                      }));
                    }
                  }}
                  addressError={addressError}
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Country:</label>

                <input
                  disabled
                  placeholder="Country"
                  value={newPlace.address?.country ?? ""}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Admin. Area Lvl 2:</label>

                <input
                  disabled
                  placeholder="Admin. Area Lvl 2"
                  value={newPlace.address?.administrativeAreaLevel2 ?? ""}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Admin. Area Lvl 1:</label>

                <input
                  disabled
                  placeholder="Admin. Area Lvl 1"
                  value={newPlace.address?.administrativeAreaLevel1 ?? ""}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 my-4 w-full">
              <div className="w-full flex flex-col gap-2 items-start">
                <label>Route:</label>

                <input
                  disabled
                  placeholder="Route"
                  value={newPlace.address?.route ?? ""}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Street Number:</label>

                <input
                  disabled
                  placeholder="Street Number"
                  value={newPlace.address?.streetNumber ?? ""}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Postal Code:</label>

                <input
                  disabled
                  placeholder="Postal Code"
                  value={newPlace.address?.postalCode ?? ""}
                  type="text"
                  className="bg-gray-50 opacity-50 w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 my-4 w-full">
              <div className="w-full flex flex-col gap-2 items-start">
                <label>Place State:</label>

                {newPlace.placeState && (
                  <PlaceStatePicker
                    widthStyle="relative w-full"
                    dotStyle="text-gray-400"
                    selectedOptionStyle="bg-gray-300"
                    optionStyle="flex flex-row gap-2 items-center text-black px-4 py-2 cursor-pointer hover:bg-gray-200 duration-100 transition-colors"
                    style="px-4 py-2 bg-white cursor-pointer shadow-sm"
                    dropdownStyle="bg-gray-50 text-black shadow-sm"
                    setSelectedState={(placeState) => {
                      const ps = placeState ?? place.placeState;
                      setNewPlace((prevState) => ({
                        ...prevState,
                        placeState: ps,
                      }));
                    }}
                    selectedState={newPlace.placeState}
                  />
                )}
              </div>

              <div className="w-full flex flex-col gap-2 items-start">
                <label>Page Link:</label>

                <input
                  placeholder="Page Link"
                  value={newPlace.pageLink}
                  onChange={(e) =>
                    setNewPlace((prevState) => ({
                      ...prevState,
                      pageLink: e.target.value,
                    }))
                  }
                  type="text"
                  className="w-full px-4 py-2 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-start gap-4 mt-12">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-400 hover:bg-green-500 transition-colors duration-200 shadow-md rounded-md text-white text-xl"
            >
              Update
            </button>
            <button
              onClick={() => handleReset()}
              className="px-4 py-2 bg-red-400 hover:bg-red-500 transition-colors duration-200 shadow-md rounded-md text-white text-xl"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaceDetails;
