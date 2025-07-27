import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import bitcoin from "../assets/bitcoin.svg";
import { CustomButton, FormField } from "../components";
import { checkIfImage } from "../utils";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };
  const handleSubmit = () => {};
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && "Loader..."}
      <div
        className="flex justify-center items-center p-[16px] 
      sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]"
      >
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a campaign
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeHolder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => {
              handleFormFieldChange("name", e);
            }}
          />
          <FormField
            labelName="Campaign Title *"
            placeHolder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => {
              handleFormFieldChange("title", e);
            }}
          />
        </div>
        <FormField
          labelName="Story *"
          placeHolder="Write your story"
          inputType="text"
          isTextArea
          value={form.description}
          handleChange={(e) => {
            handleFormFieldChange("description", e);
          }}
        />
        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-currency-bitcoin"
            viewBox="0 0 16 16"
            className="w-[40px] h-[40px] object-contain text-white"
          >
            <path d="M5.5 13v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.5v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.084c1.992 0 3.416-1.033 3.416-2.82 0-1.502-1.007-2.323-2.186-2.44v-.088c.97-.242 1.683-.974 1.683-2.19C11.997 3.93 10.847 3 9.092 3H9V1.75a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25V3h-.573V1.75a.25.25 0 0 0-.25-.25H5.75a.25.25 0 0 0-.25.25V3l-1.998.011a.25.25 0 0 0-.25.25v.989c0 .137.11.25.248.25l.755-.005a.75.75 0 0 1 .745.75v5.505a.75.75 0 0 1-.75.75l-.748.011a.25.25 0 0 0-.25.25v1c0 .138.112.25.25.25zm1.427-8.513h1.719c.906 0 1.438.498 1.438 1.312 0 .871-.575 1.362-1.877 1.362h-1.28zm0 4.051h1.84c1.137 0 1.756.58 1.756 1.524 0 .953-.626 1.45-2.158 1.45H6.927z" />
          </svg>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeHolder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => {
              handleFormFieldChange("target", e);
            }}
          />
          <FormField
            labelName="End Date *"
            placeHolder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => {
              handleFormFieldChange("deadline", e);
            }}
          />
          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton
              btnType="submit"
              title="Submit new campaign"
              style="bg-violet-700"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreateCampaign;
