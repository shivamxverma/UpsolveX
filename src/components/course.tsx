// components/course.tsx
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
      className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {name}
        </h3>
        <p
          className={`mt-2 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>
        <button
          className={`mt-4 font-medium transition-colors ${
            theme === "dark"
              ? "text-indigo-400 hover:text-indigo-300"
              : "text-indigo-600 hover:text-indigo-800"
          }`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Course;