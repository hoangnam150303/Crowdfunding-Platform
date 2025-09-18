// NavBar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton, Login } from "./";
import search from "../assets/search.svg";
import logo_crowdfunding from "../assets/logo_crowdfunding.png";
import menu from "../assets/menu.svg";
import { navlinks } from "../constants";
import authApi from "../hooks/auth.api";
import { useAuth } from "../context/auth.context";

const NavBar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();

  const onConnectClick = () => {
    if (user) {
      navigate("create-campaign");
    } else {
      setShowLogin(true);
    }
  };
  const loginWithGoogle = async () => {
    try {
      await authApi.postLoginWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* search */}
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />
        <div className="w-[72px] h-full rounded-[20px] bg-violet-700 flex justify-center items-center cursor-pointer">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      {/* desktop actions */}
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={user ? "Create a campaign" : "Sign In"}
          style={user ? "bg-violet-700" : "bg-sky-700"}
          handleClick={onConnectClick}
        />
        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={logo_crowdfunding}
              alt="logo"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* mobile nav */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo_crowdfunding}
            alt="logo"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
        <img
          src={menu}
          alt="menu_icon"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />
        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4
            ${
              !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
            } transition-all duration-700 cursor-pointer`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imageUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name
                      ? "text-violet-700"
                      : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={user ? "Create a campaign" : "Connect"}
              style={user ? "bg-violet-700" : "bg-sky-700"}
              handleClick={onConnectClick}
            />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Login
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSubmit={async ({ email, password }) => {
          try {
            const data = { email, password };
            const res = await authApi.postLoginLocal(data);
            console.log("Login response:", res);
            // Handle successful login (e.g., store user, update UI)
          } catch (error) {
            console.log(error);
          }
          setShowLogin(false);
        }}
        onGoogleLogin={() => {
          loginWithGoogle();
        }}
      />
    </div>
  );
};

export default NavBar;
