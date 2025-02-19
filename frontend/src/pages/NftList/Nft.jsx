import { useState, useEffect } from "react";
import "./Nft.scss";
import { useStore } from "../../context/StoreContext";
import CERTI from "../../assets/certifi.jpeg";
import ALPH from "../../assets/alephium.svg";
import { baseUrl } from "../../constant";
import SpinLoader from "../../components/SpinLoader/SpinLoader";
import { Link } from "react-router-dom";

const Nft = () => {
  const { wallet } = useStore();
  const [certificates, setCertificates] = useState([]);
  const [loader, setLoader] = useState(false);
  const { user, setUser } = useStore();
  useEffect(() => {
    const fetchCerti = async () => {
      try {
        setLoader(true);
        const response = await fetch(`${baseUrl}my_certificates`, {
          method: "get",
          credentials: "include",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
        });
        const result = await response.json();
        console.log(result);
        setCertificates(result);
        setLoader(false);
      } catch (err) {
        setLoader(false);
        console.error(err);
      }
    };
    fetchCerti();
  }, [wallet]);

  return (
    <div className="nft-page">
      {user != null ? (
        <>
          <div className="sec-head">My certificates</div>
          {loader ? (
            <SpinLoader />
          ) : (
            <div className="nft-list">
              {certificates?.length > 0 ? (
                certificates?.map((cert, index) => (
                  <div key={index} className="nft-card">
                    <div className="card-top">
                      {/* <img src={ALPH} width={32} height={32} alt="Alephium logo" /> */}
                    </div>
                    <div className="certi-container">
                      <img
                        src={`${baseUrl}certificate/${cert.certificate_uid}`}
                        className="certi-img"
                        alt="Certificate"
                      />
                      <a
                        className="view-btn"
                        href={`${baseUrl}certificate/${cert.certificate_uid}`}
                        download={true}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={18}
                          height={19}
                          fill="none"
                        >
                          <path
                            fill="#DAC50B"
                            d="m9 .5 2.43 6.57L18 9.5l-6.57 2.43L9 18.5l-2.43-6.57L0 9.5l6.57-2.43z"
                          />
                        </svg>
                        view certificate
                      </a>
                    </div>
                    <div className="card-name">
                      {"Certificate"}
                    </div>
                    <a className="view-poly-btn" href={`${baseUrl}certificate/${cert.certificate_uid}`} download={true} >
                      Download Certificate
                    </a>
                  </div>
                ))
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="reload-btn"
                >
                  Reload ⚡️{" "}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="connect-txt">Please Login First 😧</div>
      )}
    </div>
  );
};

export default Nft;
