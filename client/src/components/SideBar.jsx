// SideBar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun } from "lucide-react";
import logo_crowdfunding from "../assets/logo_crowdfunding.png";
import { navlinks } from "../constants";

const Icon = ({
  name,
  IconComp,
  isActive,
  disabled,
  onClick,
  className = "",
  title,
}) => {
  const active = isActive && isActive === name;
  return (
    <button
      type="button"
      title={title || name}
      aria-label={title || name}
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-[48px] h-[48px] rounded-[10px] flex justify-center items-center transition-colors",
        active ? "bg-white" : "bg-transparent",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      ].join(" ")}
    >
      {IconComp ? (
        <IconComp
          className={[
            "w-1/2 h-1/2",
            active ? "text-black" : "text-gray-400",
            !active && "opacity-80",
          ].join(" ")}
        />
      ) : null}
    </button>
  );
};

const SideBar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className="w-[52px] h-[52px] bg-[#2c2f32] rounded-[10px] flex justify-center items-center">
          <img
            src={logo_crowdfunding}
            alt="logo"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-stone-500 rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              name={link.name}
              IconComp={link.icon} // <- lucide-react icon
              isActive={active}
              disabled={link.disabled}
              title={link.name}
              onClick={() => {
                if (!link.disabled) {
                  setActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        {/* Toggle theme placeholder */}
        <button
          type="button"
          aria-label="Toggle theme"
          className="w-[48px] h-[48px] rounded-[10px] bg-[#1c1c24] shadow-secondary flex justify-center items-center"
          onClick={() => {
            // TODO: gắn logic chuyển theme nếu có
          }}
        >
          <Sun className="w-1/2 h-1/2 text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
