'use client';
import Sidebar from "@/components/Sidebar";
import { useSecured } from "@/hooks/useSecured";
import React, { ReactNode } from "react";

export type Props = {
    children: ReactNode
};

function PanelLayout({ children }: Props) {
  const { data: session, status } = useSecured();

  console.log(session)

  return <main className="flex flex-row w-full h-full">
    <Sidebar/>
    <div className="flex-1 mx-4 my-2 bg-white px-6 py-4">
      {children}
    </div>
  </main>;
}

export default PanelLayout;
