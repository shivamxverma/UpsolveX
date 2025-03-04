"use client"; 

import React from "react";
import Link from "next/link";
import { getZustandValue, setZustandValue } from "nes-zustand";
import { StreakCount } from "@/app/store/count";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const Count = getZustandValue(StreakCount);

  return (
    <div className={`grid grid-cols-10 bg-amber-300 p-4 items-center ${className}`}>
      <div className="col-span-1 flex items-center text-xl font-bold">
        EduElite
      </div>
      <div className="col-span-2 flex items-center border-2 rounded-lg">
        <input
          type="text"
          className="w-full p-2 rounded border-gray-300"
          placeholder="Search"
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <Link href="/streak/asd">🔥 {Count}</Link>
      </div>
      <div className="col-span-2 flex justify-center">Theme</div>
      <div className="col-span-2 flex justify-end">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
          Signin
        </button>
      </div>
    </div>
  );
};

export default Navbar;
