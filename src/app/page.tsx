// app/page.js
'use client';
import Navbar from "@/components/Navbar";
import Course from "@/components/course";
import About from "@/components/About";
import Testimonials from "@/components/Testinomials";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="md">
        <Navbar className="fixed top-0 w-full z-40" />
        <main className="mt-16 p-4 bg-gray-50 min-h-screen">
          <div className="flex justify-center items-center p-4">
            <Link href="/create-course">
              <button className="flex items-center bg-black text-xl font-bold text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 transition md:text-2xl cursor-pointer">
                <span className="mr-2">+</span> Create Course
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Course name="Course 1" description="This is Course 1" image="/course1.jpg" />
            <Course name="Course 2" description="This is Course 2" image="/course2.jpg" />
            <Course name="Course 3" description="This is Course 3" image="/course3.jpg" />
            <Course name="Course 4" description="This is Course 4" image="/course4.jpg" />
          </div>
          <Testimonials />
          <About />
        </main>
      </div>
    </div>
  );
}