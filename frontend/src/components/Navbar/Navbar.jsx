import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

import { AlephiumConnectButton, useWallet } from "@alephium/web3-react";

const Navbar = ({ page }) => {

  useEffect(() => {
    
  }, [])

  return (
    <>
      <nav className="nav">
        <Link className="logo" to="/">
          Un<span className="col">Mask</span>
        </Link>

        <div className="nav-group">
          <ul className="navlinks">
            <li>
              <NavLink to="/nft">My certificates</NavLink>
            </li>
           
            <li>
              {/* <NavLink to="/certification">Certification</NavLink> */}
            </li>
          </ul>
          <div className="login-btn">
          Login
          </div>
          {
            //   <button
            //   className="cssbuttons-io-button"
            //   onClick={requestAccount}
            //   style={{ gap: "10px" }}
            // >
            //   <img src={META} alt="" />
            //   <span>Connect wallet</span>
            // </button>
          }
        </div>
      </nav>
    </>
  );
};

export default Navbar;
