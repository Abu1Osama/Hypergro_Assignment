import React from 'react';

function Loader() {
  return (
    <div className='w-60 mx-auto pt-1/2 h-screen flex flex-col justify-center items-center'>
      <div className='w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin'></div>
      <p className='mt-4 text-lg font-semibold text-gray-700'>Loading...</p>
    </div>
  );
}

export default Loader;
