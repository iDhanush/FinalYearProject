import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// creating context
const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [finalResult, setFinalResult] = useState(null);
  const [imageSet, setImageSet] = useState([]);
  const [certiId, setCertiId] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [wallet, setWallet] = useState(localStorage.getItem("wallet") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const value = {
    finalResult,
    setFinalResult,
    imageSet,
    setImageSet,
    certiId,
    setCertiId,
    prediction,
    setPrediction,
    wallet,
    setWallet,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext);
};
