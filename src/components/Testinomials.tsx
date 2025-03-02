import React from 'react';

const Testimonials = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">Testimonials</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-64 md:w-72 bg-white border-2 border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <p className="text-gray-600 italic text-sm md:text-base">"Great course, learned a lot!"</p>
          <p className="mt-4 font-semibold text-gray-800">- John Doe</p>
        </div>
        <div className="w-64 md:w-72 bg-white border-2 border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <p className="text-gray-600 italic text-sm md:text-base">"Really helpful content."</p>
          <p className="mt-4 font-semibold text-gray-800">- Jane Smith</p>
        </div>
        <div className="w-64 md:w-72 bg-white border-2 border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <p className="text-gray-600 italic text-sm md:text-base">"Highly recommend this!"</p>
          <p className="mt-4 font-semibold text-gray-800">- Alex Lee</p>
        </div>
        <div className="w-64 md:w-72 bg-white border-2 border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <p className="text-gray-600 italic text-sm md:text-base">"Transformed my skills."</p>
          <p className="mt-4 font-semibold text-gray-800">- Sam Brown</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;