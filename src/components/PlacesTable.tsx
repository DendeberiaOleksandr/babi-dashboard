import { Place } from "@/slices/placeSlice";
import React from "react";

type Props = {
  places: Place[];
};

const borderClass = 'border-2 border-primary px-4 py-2';

function PlacesTable({ places }: Props) {
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
        </tr>
      </thead>
      <tbody className={borderClass}>
        {places &&
          places.map((place) => (
            <tr className={`${borderClass} hover:bg-gray-300 duration-200 transition-colors cursor-pointer`} key={place.id}>
              <td className={borderClass}>{place.id}</td>
              <td className={borderClass}>{place.name}</td>
              <td className={borderClass}>
                {
                    place.categories && place.categories.length > 0 && (
                        <select className="bg-transparent" defaultValue={place.categories[0].id}>
                            {
                                place.categories.map(category => (
                                    <option value={category.id} key={`place-${place.id}-cat-${category.id}`}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        </select>
                    )
                }
              </td>
              <td className={borderClass}>{String(place.addingDate)}</td>
              <td className={borderClass}>{place.pageLink}</td>
              <td className={borderClass}>{place.placeState}</td>
              <td className={borderClass}>{place.address?.country}</td>
              <td className={borderClass}>{place.address?.administrativeAreaLevel1}</td>
              <td className={borderClass}>{place.address?.administrativeAreaLevel2}</td>
              <td className={borderClass}>{place.address?.locality}</td>
              <td className={borderClass}>{place.address?.postalCode}</td>
              <td className={borderClass}>{place.address?.route}</td>
              <td className={borderClass}>{place.address?.streetNumber}</td>
              <td className={borderClass}>{place.address?.longitude}</td>
              <td className={borderClass}>{place.address?.latitude}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default PlacesTable;
