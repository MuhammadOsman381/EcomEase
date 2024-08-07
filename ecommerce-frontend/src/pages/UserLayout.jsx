import { Link, Navigate, Outlet } from "react-router-dom";
import React, { useState } from "react";
import Login from "./Login";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import logo from "../assets/Screenshot 2024-08-07 024607.png";
import Helpers from "../config/Helpers";

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navigator, setNavigator] = useState(false);

  const toggleNavbar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const secondToggleNavbar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const logOut = () => {
    axios
      .post(`${Helpers.apiUrl}user/logout`, {}, Helpers.authHeaders)
      .then((res) => {
        Helpers.toast("success", res.data.message);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setNavigator(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (navigator) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <nav className="fixed top-0 z-50 w-full text-black  bg-white ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="  flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleNavbar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className=" inline-flex items-center p-2 text-sm  rounded-lg   hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 "
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <div className=" flex ms-2 md:me-24">
                <img src={logo} className=" w-9 bg-white me-1 " />
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

      <aside
        id="logo-sidebar"
        className={` fixed   top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-700 delay-75  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white `}
        aria-label="Sidebar"
      >
        <div className=" h-full px-3 pb-4 overflow-y-auto bg-white  ">
          <ul className="space-y-2 font-medium">
            <li
              onClick={secondToggleNavbar}
              className="flex items-center p-2  rounded-lg text-black hover:bg-gray-300  group"
            >
              <Link to={"/user/home"}>
                <span className="ms-3">Home</span>
              </Link>
            </li>
            <li onClick={secondToggleNavbar}>
              <Link
                to={"/user/products"}
                className="flex items-center p-2  rounded-lg text-black hover:bg-gray-300  group"
              >
                <span className="ms-3">Products</span>
              </Link>
            </li>

            <li onClick={secondToggleNavbar}>
              <Link
                to={"/user/cart"}
                className="flex items-center p-2  rounded-lg text-black hover:bg-gray-300  group"
              >
                <span className="ms-3">Cart</span>
              </Link>
            </li>

            <li onClick={secondToggleNavbar}>
              <Link
                to={"/user/profile"}
                className="flex items-center p-2  rounded-lg text-black hover:bg-gray-300  group"
              >
                <span className="ms-3">Profile</span>
              </Link>
            </li>

            <button
              type="button"
              class="flex items-center justify-center gap-2 ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={logOut}
            >
              <span>Logout</span>{" "}
              <span className="mt-1 font-medium">
                <IoIosLogOut />
              </span>
            </button>
            {/* </li> */}
          </ul>
        </div>
      </aside>
      <div class="p-4 sm:ml-0">
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
