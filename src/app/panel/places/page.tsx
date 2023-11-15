"use client";
import Pagination from "@/components/Pagination";
import PlacesFilterPan from "@/components/PlacesFilterPan";
import PlacesForm from "@/components/PlacesForm";
import PlacesTable from "@/components/PlacesTable";
import { PlaceCriteria, useGetPlacesQuery } from "@/slices/placeSlice";
import React, { useState } from "react";

function PlacesPage() {
  const [formOpened, setFormOpened] = useState<boolean>(false);
  const [placeCriteria, setPlaceCriteria] = useState<PlaceCriteria>({
    page: 0,
    size: 25,
  });
  const {
    data: placePageable,
    error,
    isLoading,
  } = useGetPlacesQuery(placeCriteria);

  const handleCreateClick = () => {
    setFormOpened(!formOpened);
  };

  return (
    <div className="flex flex-col items-start justify-center">
      <div className="flex flex-row">
        <button
          onClick={handleCreateClick}
          className="hover:bg-secondary transition-colors duration-300 px-4 py-2 rounded-md bg-primary text-white"
        >
          Create
        </button>
      </div>

      {!isLoading && placePageable && placePageable.totalElements > 0 && (
        <>
          <div className="mt-6 w-full">
            <PlacesFilterPan
              placeCriteria={placeCriteria}
              setPlaceCriteria={setPlaceCriteria}
            />
          </div>

          <section className="h-full">
            <div className="mt-6 w-full h-full">
              <PlacesTable places={placePageable.data} />
            </div>
            <div className="mt-6">
              <Pagination
                totalElements={placePageable.totalElements}
                page={placeCriteria.page}
                elementsPerPage={placeCriteria.size}
                setPage={(page) =>
                  setPlaceCriteria((prevState) => ({
                    ...prevState,
                    page: page,
                  }))
                }
                setElementsPerPage={(elementsPerPage) =>
                  setPlaceCriteria((prevState) => ({
                    ...prevState,
                    size: elementsPerPage,
                  }))
                }
              />
            </div>
          </section>
        </>
      )}

      {formOpened && (
        <div
          className="absolute flex flex-col justify-center items-center z-40 left-0 right-0 bottom-0 top-0"
          style={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
        >
          <PlacesForm handleClose={() => setFormOpened(false)} />
        </div>
      )}
    </div>
  );
}

export default PlacesPage;
