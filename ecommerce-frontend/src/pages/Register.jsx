import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import Helpers from "../config/Helpers";
import logo from "../assets/Screenshot 2024-08-07 024607.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const addUserData = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    axios
      .post(`${Helpers.apiUrl}user/register`, formData, Helpers.authFileHeaders)
      .then((response) => {
        Helpers.setItem("token", response.data.token, false);
        Helpers.setItem("user", response.data.user, true);
        if (response.data.user) {
          Helpers.toast("success", response.data.message);
          setTimeout(() => {
            window.location.href = "/user/home";
          }, 600);
        } else {
          Helpers.toast("error", response.data.message);
          setTimeout(() => {
            window.location.href = "/register";
          }, 600);
        }
      })
      .catch((error) => {
        Helpers.toast("error", error.response.data.message);
      });
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full text-black  bg-white  ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="  flex items-center justify-start rtl:justify-end">
              <div className=" flex ms-2 md:me-24">
                <img src={logo} className=" w-9 bg-white me-0 " />
                <span className="self-center font-sans text-pretty text-lg font-semibold text-black sm:text-lg whitespace-nowrap">
                  EcomEase
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="p-4 sm:ml-0">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-md w-full">
            <div className="p-8 rounded-2xl bg-white shadow">
              <h2 className="text-gray-800 text-center text-2xl font-bold">
                Sign up
              </h2>
              <form className="mt-2 space-y-2">
                <div>
                  <div className="flex flex-col items-center">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="w-20 h-20 rounded-full cursor-pointer object-cover border border-gray-300"
                          onClick={handleIconClick}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded-full">
                        <FaUser
                          className="text-gray-400 w-10 h-10 cursor-pointer"
                          onClick={handleIconClick}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <label className="text-left text-gray-800 text-sm mb-2 block">
                    Name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="text"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter name"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-left text-gray-800 text-sm mb-2 block">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter email"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className=" flex items-center mt-2 ml-4 justify-center w-6 h-6 absolute text-gray-400 right-4"
                      viewBox="0 0 24 24"
                    >
                      <MdEmail />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-left text-gray-800 text-sm mb-2 block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter password"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="!mt-8">
                  <button
                    onClick={addUserData}
                    type="button"
                    className=" font-semibold w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none text-bold"
                  >
                    Sign up
                  </button>
                </div>
                <p className="text-gray-800 text-sm !mt-8 text-center">
                  if you have an account?{" "}
                  <Link
                    to={"/"}
                    className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
