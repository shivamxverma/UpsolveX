import React from 'react';

interface CourseProps {
  name: string;
  description: string;
  image: string;
}

const Course: React.FC<CourseProps> = ({ name, description, image }) => {
  return (
    <div className="w-64 border-4 border-gray-300 p-5 mt-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 md:w-72">
      <img src={image} alt={name} className="w-full h-32 object-cover rounded-t-lg" />
      <div className="mt-4">
        <p className="text-lg font-bold text-gray-800">{name}</p>
        <p className="mt-2 text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
};

export default Course;