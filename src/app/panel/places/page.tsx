"use client";
import PlacesFilterPan from "@/components/PlacesFilterPan";
import PlacesForm from "@/components/PlacesForm";
import React, { useState } from "react";

function PlacesPage() {
  const [formOpened, setFormOpened] = useState<boolean>(false);

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

      <PlacesFilterPan />

      {formOpened && <div className="absolute flex flex-col justify-center items-center z-40 left-0 right-0 bottom-0 top-0" style={{backgroundColor: "rgba(75, 85, 99, 0.6)"}}>
            <PlacesForm handleClose={() => setFormOpened(false)}/>
        </div>}
    </div>
  );
}

export default PlacesPage;
