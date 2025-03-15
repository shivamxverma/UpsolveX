// app/page.tsx
"use client";
import Navbar from "@/components/Navbar";
import Course from "@/components/course";
import About from "@/components/About";
import Testimonials from "@/components/Testinomials";
import Link from "next/link";
import { RecoilRoot } from "recoil";
import { useThemeStore } from "@/app/store/theme";

export default function Home() {
  const { theme } = useThemeStore();

  return (
    <RecoilRoot>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Navbar className="fixed top-0 left-0 right-0 z-50" />
        <main className="pt-24 pb-12 px-4 md:px-8">
          <div className="flex justify-center items-center py-8">
            <Link href="/create-course">
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all text-lg md:text-xl font-semibold ${
                  theme === "dark"
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <span className="text-2xl">+</span> Create Course
              </button>
            </Link>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Course name="Course 1" description="Master the fundamentals" image="/course1.jpg" />
            <Course name="Course 2" description="Advanced techniques" image="/course2.jpg" />
            <Course name="Course 3" description="Practical applications" image="/course3.jpg" />
            <Course name="Course 4" description="Expert-level skills" image="/course4.jpg" />
          </div>
          <Testimonials />
          <About />
        </main>
      </div>
    </RecoilRoot>
  );
}