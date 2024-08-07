import React from "react";

const CartLoader = () => {
  return (
    <div>
      <div class="flex space-x-2 justify-center items-center bg-transparent h-[16vh] mt-00 ">
        <span class="sr-only">Loading...</span>
        <div class="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div class="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div class="h-4 w-4 bg-black rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default CartLoader;
