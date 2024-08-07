import axios from "axios";
import React, { useState } from "react";
import Helpers from "../config/Helpers";
import { Navigate } from "react-router-dom";

const ProductCard = ({ proTitle, proImg, proPrice, proDesc, proModel }) => {
  const [redirect, setRedirect] = useState(false);

  const addProduct = () => {
    axios
      .post(
        `${Helpers.apiUrl}cart/create-product`,
        {
          proTitle,
          proImg,
          proPrice,
        },
        Helpers.authHeaders
      )
      .then((response) => {
        Helpers.toast("success", response.data.message);
        setTimeout(() => {
          setRedirect(true);
        }, 500);
      })
      .catch((error) => {
        Helpers.toast("error", error.response.data.message);
      });
  };

  if (redirect) {
    return <Navigate to={"/user/cart"} />;
  }

  return (
    <div className=" w-full h-full mt-20 max-sm:mt-20  flex items-center justify-center">
      <div class="   mx-4 w-[80vw] bg-gray-300  rounded-xl border-none shadow-lg  md:pl-8">
        <div class=" flex flex-col    bg-white sm:flex-row h-auto  rounded-xl ">
          <div class=" p-10 ml-auto h-full w-full bg-white sm:order-none max-sm:h-72 sm:w-3/4 lg:w-2/5">
            <img
              class=" h-full w-full object-contain"
              src={proImg}
              loading="lazy"
            />
          </div>
          <div class=" flex w-[100vw] flex-col p-4  sm:p-8 max-sm:w-full max-lg:w-[80vw]  ">
            <h2 class=" font-bold text-gray-900 text-xl max-lg:text-lg">
              {proTitle}
            </h2>
            <div className=" flex flex-wrap  items-center justify-start gap-2">
              <p class="mt-2 w-14 p-0 font-semibold text-lg text-center rounded-md bg-blue-700  text-white ">
                ${proPrice}
              </p>
            </div>
            <p class="mt-4 mb-8  text-gray-500">{proDesc}</p>
            <a
              onClick={addProduct}
              class="group mt-auto flex w-44 cursor-pointer select-none items-center justify-center rounded-md bg-black px-6 py-2 text-white transition"
            >
              <span class="group flex w-full items-center justify-center rounded py-1 text-center font-bold">
                {" "}
                Add to cart{" "}
              </span>
              <svg
                class="flex-0 group-hover:w-6 ml-4 h-6 w-0 transition-all"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
