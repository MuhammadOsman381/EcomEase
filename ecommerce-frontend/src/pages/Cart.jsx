import React, { useEffect, useState } from "react";
import Helpers from "../config/Helpers";
import axios from "axios";
import { TiMinus } from "react-icons/ti";
import { TiPlus } from "react-icons/ti";
import PaymentCard from "../components/PaymentCard";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

async function stripFunc() {
  const stripePromise = await loadStripe(
    "pk_test_51PeGfpG8qJLDolsNdaw01c2MRQktQ9YhtE4qZwv8d47xE9X4cVEZZjMo7ZPlwEkxQ1l1Eq704K8XnoLSEbVNqKwZ00398SxkfS"
  );
  return stripePromise;
}

const Cart = () => {
  const [subTotal, setSubTotal] = useState("");
  const [productsArray, setProductsArray] = useState([]);
  const [refresher, setRefresher] = useState(false);
  const [navigateToCheckOut, setNavigateToCheckOut] = useState(false);

  const getProducts = () => {
    axios
      .get(`${Helpers.apiUrl}cart/get-product`, Helpers.authHeaders)
      .then((response) => {
        setProductsArray(response.data.products);
        setSubTotal(response.data.subtotal);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const truncateTitle = (words, wordsLimit) => {
    const splittedWords = words.split(" ");
    if (splittedWords.length <= wordsLimit) {
      return splittedWords.join(" ");
    }
    return splittedWords.slice(0, wordsLimit).join(" ") + "...";
  };

  const incrementOrDecrement = (value, id) => {
    axios
      .post(`${Helpers.apiUrl}cart/inc-dec`, { value, id }, Helpers.authHeaders)
      .then((response) => {
        setRefresher(!refresher);
        Helpers.toast("success", response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeItem = (id) => {
    axios
      .post(`${Helpers.apiUrl}cart/remove`, { id }, Helpers.authHeaders)
      .then((response) => {
        setRefresher(!refresher);
        Helpers.toast("success", response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProducts();
  }, [refresher]);

  return (
    <>
      {!navigateToCheckOut && (
        <div className=" mt-16">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-600">Cart</h1>
            {productsArray?.length > 0 ? (
              <div className="  flex flex-col md:flex-row gap-2">
                <div className="custom-scrollbar p-8 rounded-lg  shadow-md bg-white  md:w-3/4">
                  {productsArray?.length > 0 &&
                    productsArray.map((items) => {
                      return (
                        <div className="custom-scrollbar overflow-auto bg-white border border-gray-200 border-t-[4px] rounded-lg shadow-md p-6 mb-4">
                          <table className="custom-scrollbar overflow-auto w-[63vw] max-sm:w-[140vw]">
                            <thead>
                              <tr>
                                <th className="text-left font-bold text-gray-600">
                                  Product
                                </th>
                                <th className="text-left font-bold text-gray-600">
                                  Price
                                </th>
                                <th className="text-left font-bold text-gray-600">
                                  Quantity
                                </th>
                                <th className="text-left font-bold">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className=" ">
                                <td className="py-2 ml-2">
                                  <div className=" flex items-center">
                                    <img
                                      className="h-20 w-20 mr-4"
                                      src={items.image}
                                      alt="Product image"
                                    />
                                    <span className=" font-semibold">
                                      {truncateTitle(items.title, 6)}
                                    </span>
                                  </div>
                                </td>
                                <td className=" ml-2  py-2">${items.price}</td>
                                <td className="ml-2 py-2">
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        incrementOrDecrement(-1, items._id)
                                      }
                                      className="border border-gray-400 text-center text-md rounded-md text-gray-500  hover:bg-gray-400 hover:text-white p-2  mr-0"
                                    >
                                      <TiMinus />
                                    </button>
                                    <span className="text-center w-8">
                                      {items.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        incrementOrDecrement(1, items._id)
                                      }
                                      className="border border-gray-400 text-center text-md rounded-md text-gray-500  hover:bg-gray-400 hover:text-white p-2  ml-0"
                                    >
                                      <TiPlus />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2 ml-2">
                                  ${items.totalPrice}
                                </td>
                                <td className="py-0 ml-2">
                                  {" "}
                                  <button
                                    onClick={() => removeItem(items._id)}
                                    className="bg-red-500  text-white hover:bg-red-600  rounded-md py-1 px-2 ml-0 max-sm:w-[30vw] max-lg:w-[12vw]"
                                  >
                                    Remove Item
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                </div>
                <div className="md:w-1/4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-600  border-b border-gray-600 p-1 ">
                      Summary
                    </h2>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${subTotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Taxes</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>$10.00</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        ${subTotal + 2.99 + 10.0}
                      </span>
                    </div>
                    <button
                      onClick={() => setNavigateToCheckOut(true)}
                      className="bg-black font-semibold text-white py-2 px-4 rounded-lg mt-4 w-full"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 flex items-center justify-center text-lg font-semibold ">
                <h1>No items found in the cart</h1>
              </div>
            )}
          </div>
        </div>
      )}

      {navigateToCheckOut && (
        <Elements stripe={stripFunc()}>
          <PaymentCard price={subTotal + 2.99 + 10.0} />
        </Elements>
      )}
    </>
  );
};

export default Cart;
