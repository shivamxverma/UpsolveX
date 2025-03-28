"use client";

import React from "react";
import Link from "next/link";
import { getZustandValue } from "nes-zustand";
import { StreakCount } from "@/app/store/count";
import { useThemeStore } from "@/app/store/theme"; // Import theme store
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const Count = getZustandValue(StreakCount);
  const { theme, toggleTheme } = useThemeStore(); // Use theme store

  // Apply theme to document root
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <nav
      className={`grid grid-cols-12 p-4 items-center shadow-lg transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-800 to-gray-900"
          : "bg-gradient-to-r from-indigo-600 to-purple-600"
      } ${className}`}
    >
      {/* Logo */}
      <div className="col-span-2 flex items-center">
        <Link
          href="/"
          className={`text-2xl font-bold tracking-tight transition-colors ${
            theme === "dark" ? "text-gray-100 hover:text-indigo-300" : "text-white hover:text-indigo-200"
          }`}
        >
          EduElite
        </Link>
      </div>

      {/* Search Bar */}
      <div className="col-span-4 flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            className={`w-full p-2 pl-10 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-indigo-500"
                : "bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-indigo-300"
            } focus:outline-none focus:ring-2 transition-all`}
            placeholder="Search courses..."
          />
          <svg
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === "dark" ? "text-gray-400" : "text-white/70"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Streak */}
      <div className="col-span-2 flex justify-center">
        <Link
          href="/streak/asd"
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            theme === "dark"
              ? "text-gray-100 bg-gray-700 hover:bg-gray-600"
              : "text-white bg-white/10 hover:bg-white/20"
          }`}
        >
          <span className="text-orange-300">🔥</span>
          <span className="font-semibold">{Count}</span>
        </Link>
      </div>

      {/* Theme Toggle */}
      <div className="col-span-2 flex justify-center">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            theme === "dark"
              ? "text-gray-100 hover:bg-gray-700"
              : "text-white hover:bg-white/10"
          }`}
        >
          {theme === "dark" ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </Button>
      </div>

      {/* Sign In Button */}
      <div className="col-span-2 flex justify-end">
        <Link
          className={`px-6 py-2 rounded-full font-semibold shadow-md transition-colors ${theme === "dark"
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-white text-indigo-600 hover:bg-indigo-100"}`} href={"/login"}        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;