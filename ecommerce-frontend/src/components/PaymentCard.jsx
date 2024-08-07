import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Helpers from "../config/Helpers";
import { Navigate } from "react-router-dom";

const PaymentCard = ({ price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    try {
      const response = await axios.post(
        `${Helpers.apiUrl}payment/create-payment-intent`,
        {
          amount: price,
          currency: "usd",
          paymentMethodId: paymentMethod.id,
          email,
          name,
        },
        Helpers.authHeaders
      );
      console.log(response);
      const { clientSecret } = response.data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Your Name",
          },
        },
      });
      console.log(result);
      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          Helpers.toast("success", "Payment successful!");
        }
      }
    } catch (error) {
      setError(error.message);
    }
    setProcessing(false);
    setTimeout(() => {
      setRedirect(true);
    }, 500);
  };

  const getProfileData = async () => {
    axios
      .get(`${Helpers.apiUrl}user/profile`, Helpers.authHeaders)
      .then(async (response) => {
        setEmail(response.data.user.email);
        setName(response.data.user.name);
      })
      .catch((error) => {
        console.log(error);
        Helpers.toast("error", error.response.data.message);
      });
  };

  if (redirect) {
    return <Navigate to={"/user/profile"} />;
  }

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div className=" w-full h-full flex items-center mt-20 justify-center">
      <div className="w-[50vw] h-[70vh] max-w-full max-h-full max-sm:w-full max-sm:h-[66vh] border-none rounded-lg shadow-lg p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Payment Information
          </h2>

          <input
            value={name}
            placeholder="Your name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 text-gray-600 outline-none bg-gray-50 w-full text-[14px] p-2 px-4 rounded-lg"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
            className="border border-gray-300 text-gray-600 outline-none bg-gray-50 w-full text-[14px] p-2 px-4 rounded-lg"
          />

          <input
            value={`$${price}`}
            placeholder="Your amount"
            type="text"
            className="border border-gray-300 text-gray-600 outline-none bg-gray-50 w-full text-[14px] p-2 px-4 rounded-lg"
          />

          <div className="p-2 border border-gray-300 rounded-lg bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#a0aec0",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                },
              }}
              disabled={!stripe || processing}
              className="p-1"
            />
          </div>
          <button
            type="submit"
            disabled={!stripe || processing}
            className="w-full py-2 bg-black text-white font-semibold rounded-lg transition duration-300"
          >
            {processing ? "Processing..." : "Pay"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default PaymentCard;
