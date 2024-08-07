import React from "react";

const Loader = () => {
  return (
    <div>
      <div class="flex space-x-2 justify-center items-center bg-transparent h-[16vh] mt-20 ">
        <span class="sr-only">Loading...</span>
        <div class="h-6 w-6 max-sm:h-4 max-sm:w-4  bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div class="h-6 w-6 max-sm:h-4 max-sm:w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div class="h-6 w-6 max-sm:h-4 max-sm:w-4 bg-black rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loader;
