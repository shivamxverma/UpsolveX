"use client"; // Add this since we're using hooks

import React from "react";
import { useThemeStore } from "@/app/store/theme"; // Import the theme store
import { Button } from "@/components/ui/button"; // Assuming you have a reusable Button component

const About = () => {
  const { theme } = useThemeStore(); // Access the current theme

  return (
    <section
      className={`py-12 md:py-16 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-800" // Dark mode background
          : "bg-indigo-50" // Light mode background
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1
          className={`text-3xl md:text-4xl font-bold mb-6 transition-colors ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          About Us
        </h1>
        <p
          className={`mb-8 text-sm md:text-base leading-relaxed transition-colors ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate illum
          perspiciatis omnis ea quas officiis rem minus natus molestias, distinctio
          quisquam repellendus harum nesciunt eum eaque nulla suscipit quis recusandae.
        </p>
        <Button
          className={`px-6 py-3 rounded-full font-semibold shadow-lg transition-all ${
            theme === "dark"
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Learn More
        </Button>
        <div className="mt-8">
          <img
            src="car.jpg"
            className={`mx-auto rounded-full w-32 h-32 md:w-40 md:h-40 object-cover transition-shadow ${
              theme === "dark" ? "shadow-gray-700" : "shadow-md"
            }`}
            alt="About illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default About;