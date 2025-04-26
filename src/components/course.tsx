import React from "react";
import { useThemeStore } from "@/app/store/theme";

interface CourseProps {
  name: string;
  description: string;
  image: string;
}

const Course: React.FC<CourseProps> = ({ name, description, image }) => {
  const { theme } = useThemeStore();

  return (
    <div
      className={`rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative group ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Image with Overlay */}
      <div className="relative w-full h-56">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center`}
        >
          <span
            className={`text-white text-sm font-semibold px-4 py-2 rounded-full mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ${
              theme === "dark" ? "bg-indigo-500/80" : "bg-indigo-600/80"
            }`}
          >
            Explore Now
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3
          className={`text-2xl font-bold tracking-tight ${
            theme === "dark" ? "text-indigo-300" : "text-indigo-600"
          }`}
        >
          {name}
        </h3>
        <p
          className={`mt-2 text-base leading-relaxed ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>
        <button
          className={`mt-4 px-5 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide shadow-md transition-all duration-200 transform hover:scale-110 ${
            theme === "dark"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          Learn More
        </button>
      </div>

      {/* Decorative Element */}
      <div
        className={`absolute top-0 left-0 w-16 h-16 opacity-10 rounded-full blur-2xl ${
          theme === "dark" ? "bg-indigo-400" : "bg-indigo-600"
        }`}
      ></div>
    </div>
  );
};

export default Course;