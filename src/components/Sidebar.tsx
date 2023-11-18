import Link from "next/link";
import React from "react";
import { AiFillHome, AiFillQuestionCircle } from "react-icons/ai";
import { TbCategoryFilled } from "react-icons/tb";
import { HiBuildingStorefront } from "react-icons/hi2";
import { usePathname } from "next/navigation";

type Route = {
  id: number;
  text: string;
  icon: any;
  path: string;
};

const routes: Route[] = [
  {
    id: 1,
    text: "Home",
    icon: <AiFillHome />,
    path: "/panel",
  },
  {
    id: 2,
    text: "Categories",
    icon: <TbCategoryFilled />,
    path: "/panel/categories",
  },
  {
    id: 3,
    text: "Questions",
    icon: <AiFillQuestionCircle />,
    path: "/panel/questions",
  },
  {
    id: 4,
    text: "Places",
    icon: <HiBuildingStorefront />,
    path: "/panel/places",
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-[320px] h-full bg-thirdly drop-shadow-md justify-between px-12 py-4">
      <h1 className="text-center text-white drop-shadow drop-shadow-primary text-3xl font-semibold">Babi</h1>
      <div className="flex flex-col gap-4">
        {routes.map((route) => (
          <Link
            key={route.id}
            href={route.path}
            className={`bg-primary hover:bg-secondary transition-colors duration-200 px-4 py-1 rounded-sm text-lg font-semibold flex flex-row items-center justify-center gap-2  ${pathname === route.path ? 'bg-yellow text-primary' : 'text-white'}`}
          >
            <span className="cursor-pointer">{route.icon}</span>
            <label className="cursor-pointer">{route.text}</label>
          </Link>
        ))}
      </div>
      <p className="text-center text-gray-500 text-[14px]">Babi © 2023</p>
    </div>
  );
}

export default Sidebar;
