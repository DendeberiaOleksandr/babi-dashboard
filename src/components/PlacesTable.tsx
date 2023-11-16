import { Place } from "@/slices/placeSlice";
import React from "react";
import { FaTrash } from "react-icons/fa";

type Props = {
  places: Place[];
  setSelectedPlace: (place: Place) => void;
};

const borderClass = 'border-2 border-primary px-4 py-2';

function PlacesTable({ places, setSelectedPlace }: Props) {

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
  };

  return (
    <table className={`border-collapse ${borderClass}`}>
      <thead className={borderClass}>
        <tr className={borderClass}>
          <th className={borderClass}>Id</th>
          <th className={borderClass}>Name</th>
          <th className={borderClass}>Category</th>
          <th className={borderClass}>Adding Date</th>
          <th className={borderClass}>Page Link</th>
          <th className={borderClass}>Place State</th>
          <th className={borderClass}>Country</th>
          <th className={borderClass}>Ad. Area 1</th>
          <th className={borderClass}>Ad. Area 2</th>
          <th className={borderClass}>Locality</th>
          <th className={borderClass}>Postal Code</th>
          <th className={borderClass}>Route</th>
          <th className={borderClass}>St. Number</th>
          <th className={borderClass}>Longitude</th>
          <th className={borderClass}>Latitude</th>
          <th className={borderClass}>Delete</th>
        </tr>
      </thead>
      <tbody className={borderClass}>
        {places &&
          places.map((place) => (
            <tr className={`${borderClass} hover:bg-gray-300 duration-200 transition-colors cursor-pointer`} key={place.id}>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.id}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.name}</td>
              <td className={borderClass}>
                {
                    place.categories && place.categories.length > 0 && (
                        <select className="bg-transparent px-4 py-2" defaultValue={place.categories[0].id}>
                            {
                                place.categories.map(category => (
                                    <option className="px-4 py-2" value={category.id} key={`place-${place.id}-cat-${category.id}`}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        </select>
                    )
                }
              </td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{String(place.addingDate)}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.pageLink}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.placeState}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.country}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.administrativeAreaLevel1}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.administrativeAreaLevel2}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.locality}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.postalCode}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.route}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.streetNumber}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.longitude}</td>
              <td onClick={(e) => handlePlaceClick(place)} className={borderClass}>{place.address?.latitude}</td>
              <td className={borderClass}>
                <label className="flex items-center justify-center text-red-400 hover:text-red-500 cursor-pointer">
                  <FaTrash/>
                </label>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default PlacesTable;
