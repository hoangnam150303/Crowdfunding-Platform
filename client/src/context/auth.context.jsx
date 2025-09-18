import {createContext, useEffect, useState } from "react";
import authApi from "../hooks/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ Children }) => {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const res = await authApi.getUser();
      console.log(res);
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {Children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
