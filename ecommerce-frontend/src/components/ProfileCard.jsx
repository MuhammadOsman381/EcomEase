import axios from "axios";
import React, { useEffect, useState } from "react";
import Helpers from "../config/Helpers";
import { Navigate } from "react-router-dom";

const ProfileCard = () => {
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [id, setID] = useState("");
  const getProfileData = async () => {
    axios
      .get(`${Helpers.apiUrl}user/profile`, Helpers.authHeaders)
      .then(async (response) => {
        setImage(response.data.image);
        setEmail(response.data.user.email);
        setName(response.data.user.name);
        setID(response.data.user._id);
      })
      .catch((error) => {
        console.log(error);
        Helpers.toast("error", error.response.data.message);
      });
  };

  const deleteAccount = () => {
    axios
      .delete(`${Helpers.apiUrl}user/delete/${id}`, Helpers.authHeaders)
      .then(async (response) => {
        Helpers.toast("success", response.data.message);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      })
      .catch((error) => {
        console.log(error);
        Helpers.toast("error", error.response.data.message);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div>
      <div class="relative w-full  bg-white max-w-2xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-none border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">
        <span class="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-none ">
          User
        </span>
        <div class="w-full flex justify-center sm:justify-start sm:w-auto">
          <img
            class="object-cover w-28 h-28 mt-3 mr-3 rounded-full"
            src={image}
          />
        </div>

        <div class=" w-80 flex flex-col items-center sm:items-start">
          <p
            class="font-display mb-2 text-2xl font-semibold dark:text-gray-500"
            itemprop="author"
          >
            {name}
          </p>

          <div class="mb-4 md:text-lg text-gray-400">
            <p>{email}</p>
          </div>

          <div class="flex gap-2">
            <button
              onClick={deleteAccount}
              class="bg-red-500 font-semibold text-white py-1 px-2 border border-red-500 hover:bg-red-600  rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
