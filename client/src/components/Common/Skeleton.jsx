import React from 'react';

const Skeleton = ({ className, repeat = 1 }) => {
  return (
    <>
      {[...Array(repeat)].map((_, i) => (
        <div 
          key={i}
          className={`bg-gray-200 animate-pulse rounded-sm ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
