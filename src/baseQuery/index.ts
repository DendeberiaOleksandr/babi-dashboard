import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { getSession } from "next-auth/react";

const addTokenToRequest = async (headers: any, { getState }: any) => {
  const session: any = await getSession();
  if (session?.user?.token) {
    headers.set("Authorization", `Bearer ${session.user.token}`);
  }
  return headers;
};

export default fetchBaseQuery({
  baseUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }: any) => {
    return addTokenToRequest(headers, { getState });
  },
});
