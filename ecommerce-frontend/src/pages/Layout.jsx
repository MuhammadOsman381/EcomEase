import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/Screenshot 2024-08-07 024607.png";
import Login from "./Login";

const Layout = () => {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full text-black  bg-white  ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="  flex items-center justify-start rtl:justify-end">
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

      <div class="p-4 sm:ml-0">
        <Login />
      </div>
    </>
  );
};

export default Layout;
