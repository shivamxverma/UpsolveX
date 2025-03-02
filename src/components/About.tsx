import React from 'react';

const About = () => {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center bg-gray-300">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">About</h1>
      <div className="max-w-md text-center">
        <p className="font-semibold text-gray-700">About us</p>
        <p className="mb-6 text-gray-600 text-sm md:text-base">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate illum perspiciatis omnis ea quas officiis rem minus natus molestias, distinctio quisquam repellendus harum nesciunt eum eaque nulla suscipit quis recusandae.</p>
        <button className="bg-black text-white font-bold text-lg md:text-xl px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 transition">Learn More</button>
      </div>
      <img src="car.jpg" className="mt-6 border border-gray-300 rounded-md size-24 md:size-32 object-cover" alt="Car" />
    </div>
  );
};

export default About;