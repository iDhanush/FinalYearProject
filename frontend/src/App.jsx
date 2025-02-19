import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";

import { StoreProvider } from "./context/StoreContext";

import toast, { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Pricing from "./pages/Pricing/Pricing";
import Certificate from "./pages/certificate/Certificate";
import ResultPage from "./pages/ResultPage/ResultPage";
import Nft from "./pages/NftList/Nft";

import { AlephiumWalletProvider } from "@alephium/web3-react";
import AdminLoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/signup/SignUp";
import FeedbackPopup from "./components/Feedback/Feedback";
import { useState } from "react";

function App() {
  const [popUp, setPopup] = useState(false);
  return (
    <AlephiumWalletProvider useTheme="retro">
      <StoreProvider>
        <div className="app">
          <div>
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/certification"
              element={<Certificate/>}
            />
            <Route
              path="/result"
              element={<ResultPage/>}
            />
            <Route path="/nft" element={<Nft />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
          {popUp && <FeedbackPopup popUp={popUp} setPopup={setPopup} />}
        </div>
      </StoreProvider>
    </AlephiumWalletProvider>
  );
}

export default App;
