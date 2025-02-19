import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

import { AlephiumConnectButton, useWallet } from "@alephium/web3-react";
import { baseUrl } from "../../constant";

const Navbar = ({ page }) => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const logOut = async () => {
    const res = await fetch(`${baseUrl}logout`, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    });
    const result = await res.json();
    console.log(result);
    if (result.message) {
      navigate("/");
      setUser(null);
      localStorage.clear();
      window.location.reload();
    }
  };
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
          <div
            className="login-btn"
            onClick={() => {
              if (user != null) {
                logOut();
              } else {
                navigate("/login");
              }
            }}
          >
            {user ? "Login Out" : "Login"}
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
