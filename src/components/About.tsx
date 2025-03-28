"use client"; // Required for hooks

import React from "react";
import { useThemeStore } from "@/app/store/theme";
import { Button } from "@/components/ui/button"; // Assuming this exists

const About = () => {
  const { theme } = useThemeStore();

  return (
    <section
      className={`relative py-16 md:py-20 transition-colors duration-300 overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
          : "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50"
      }`}
    >
      {/* Background Decorative Element */}
      <div
        className={`absolute inset-0 opacity-20 animate-pulse-slow ${
          theme === "dark" ? "bg-indigo-500/30 blur-3xl" : "bg-indigo-600/30 blur-3xl"
        }`}
      ></div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Title */}
        <h1
          className={`text-4xl md:text-5xl font-extrabold mb-6 animate-text-reveal ${
            theme === "dark"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
              : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          }`}
        >
          About Us
        </h1>

        {/* Description */}
        <p
          className={`mb-10 text-base md:text-lg leading-relaxed max-w-2xl mx-auto animate-fade-in-delay ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          We’re passionate about empowering learners and creators. Dive into a world of knowledge, compete in exciting contests, and unleash your potential with us!
        </p>

        {/* Button */}
        <Button
          className={`px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          Discover More
        </Button>

        {/* Image with Effect */}
        <div className="mt-12 relative group">
          <div
            className={`absolute -inset-2 bg-gradient-to-r ${
              theme === "dark" ? "from-indigo-500/50 to-purple-500/50" : "from-indigo-600/50 to-purple-600/50"
            } rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
          ></div>
          <img
            src="/car.jpg" // Ensure this exists in public/
            className={`relative mx-auto rounded-full w-40 h-40 md:w-48 md:h-48 object-cover transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-2xl ${
              theme === "dark" ? "shadow-gray-800" : "shadow-indigo-500/40"
            }`}
            alt="About illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default About;