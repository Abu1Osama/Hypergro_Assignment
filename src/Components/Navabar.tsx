import React from "react";
import { useState } from "react";
import toplogo from "../assest/logo.png"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-gray-200 sticky top-0 z-50 bg-[#232d2d] dark:bg-gray-800 dark:border-gray-700 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between  p-2">
        <a href="/" className="flex items-center">
          <img
            src={toplogo}
            className=" w-14 mr-3"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-amber-600">
            Osama
          </span>
        </a>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-[#5a7575] dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-dropdown"
        >
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-[#232d2d] md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <a
                href="/"
                className="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent  hover:text-lime-400"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/actors"
                className="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent hover:text-lime-400"
              >
                Actors
              </a>
            </li>
            <li>
              <a
                href="/reels"
                className="block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent hover:text-lime-400"
              >
               Reels
              </a>
            </li>
          </ul> 
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
