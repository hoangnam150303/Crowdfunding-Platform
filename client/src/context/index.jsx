import React, { useContext, createContext } from "react";
import {
  useAddress,
  metamaskWallet,
  useContract,
  useContractWrite,
  useConnect,
} from "@thirdweb-dev/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const { mutateAsync: createCampaign, isLoading } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();

  const connect = useConnect();
  const connectWithMetamask = async () => {
    await connect(metamaskWallet());
  };

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]);
      console.log("✅ Contract call success!", data);
    } catch (error) {
      console.log("❌ Contract call failure", error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
        connectWithMetamask,
        isLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
