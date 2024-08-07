import axios from "axios";
import React, { useEffect, useState } from "react";
import Helpers from "../config/Helpers";
import Loader from "./Loader";
import CartLoader from "./CartLoader";

const History = () => {
  const [productsArray, setProductsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProducts = () => {
    axios
      .get(`${Helpers.apiUrl}history/get-product`, Helpers.authHeaders)
      .then((response) => {
      
        setProductsArray(response.data.products);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
       
      });
  };

  const truncateTitle = (words, wordsLimit) => {
    const splittedWords = words.split(" ");
    if (splittedWords.length <= wordsLimit) {
      return splittedWords.join(" ");
    }
    return splittedWords.slice(0, wordsLimit).join(" ") + "...";
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {isLoading == true ? (
        <CartLoader />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="w-full h-full text-gray-600 px-10 py-2 mb-7 text-2xl font-semibold  ">
            History
          </h1>
          {productsArray?.length > 0 ? (
            <div className=" p-10 max-sm:p-6 rounded-lg shadow-md bg-white md:w-3/4 w-full flex flex-col items-center justify-center gap-4">
              {productsArray?.length > 0 &&
                productsArray.map((items) => {
                  return (
                    <div className="custom-scrollbar overflow-auto  bg-white border border-gray-300 border-t-[4px] rounded-lg shadow-md p-6 w-full">
                      <table className=" custom-scrollbar  overflow-auto w-full max-w-[180vw] max-sm:w-[200vw]">
                        <thead>
                          <tr>
                            <th className="text-left font-bold">Product</th>
                            <th className="text-left font-bold">Price</th>
                            <th className="text-left font-bold">Quantity</th>
                            <th className="text-left font-bold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2 ml-2">
                              <div className="flex items-center">
                                <img
                                  className="h-20 w-20 mr-4"
                                  src={items.image}
                                  alt="Product image"
                                />
                                <span className="font-semibold">
                                  {truncateTitle(items.title, 6)}
                                </span>
                              </div>
                            </td>
                            <td className="ml-2 py-2">${items.price}</td>
                            <td className="ml-2 py-2">
                              <div className="flex items-center">
                                <span className="text-center w-8">
                                  {items.quantity}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 ml-2">${items.totalPrice}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-[2.5vh] text-gray-600">
              No history items found
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default History;
