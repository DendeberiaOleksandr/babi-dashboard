import baseQuery from "@/baseQuery";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PlaceCriteria {
  page: number;
  size: number;
  placeId?: number;
  categoryId?: number;
  placeState?: PlaceState;
  addingDateFrom?: Date;
  addingDateTo?: Date;
  route?: string;
  locality?: string;
  administrativeAreaLevel1?: string;
  country?: string;
  postalCode?: string;
  administrativeAreaLevel2?: string;
}

export interface Place {
  id?: number;
  name?: string;
  imagesId?: number[];
  categoriesId?: number[];
  pageLink?: string;
  addingDate?: Date;
  placeState?: PlaceState;
  address?: Address;
}

export type Address = {
  streetNumber?: string;
  route?: string;
  locality?: string;
  administrativeAreaLevel2?: string;
  administrativeAreaLevel1?: string;
  country?: string;
  postalCode?: string;
  longitude?: number;
  latitude?: number;
};

export enum PlaceState {
    APPROVED, REVIEW, HIDDEN
}

export interface QuestionInitialState {
  places: Place[];
}

const initialState: QuestionInitialState = {
  places: [],
};

export const placeSlice = createApi({
  reducerPath: "place",
  baseQuery: baseQuery,
  tagTypes: ["Place", "Category"],
  endpoints: (builder) => ({
    createPlace: builder.mutation<Place, Place>({
      query: (body) => ({
        url: '/places',
        method: 'POST',
        body
      }),
      invalidatesTags: ["Place"],
    })
  }),
});

export const {
  useCreatePlaceMutation,
} = placeSlice;
