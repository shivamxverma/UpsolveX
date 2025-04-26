// components/Testinomials.tsx
import React from "react";
import { useThemeStore } from "@/app/store/theme";

const Testimonials = () => {
  const { theme } = useThemeStore();

  return (
    <section
      className={`py-12 md:py-16 transition-colors ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { quote: "Great course, learned a lot!", author: "John Doe" },
            { quote: "Really helpful content.", author: "Jane Smith" },
            { quote: "Highly recommend this!", author: "Alex Lee" },
            { quote: "Transformed my skills.", author: "Sam Brown" },
          ].map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${
                theme === "dark" ? "bg-gray-700" : "bg-white"
              }`}
            >
              <p
                className={`text-sm md:text-base italic mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                "{testimonial.quote}"
              </p>
              <p
                className={`font-semibold ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                - {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;