import "./ResultPage.scss";
import { useStore } from "../../context/StoreContext";
import { Progress } from "rsuite";
import { baseUrl } from "../../constant";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import SpinLoader from "../../components/SpinLoader/SpinLoader";

const ResultPage = () => {
  const customProgressBarStyle = {
    width: "200px",
    height: "200px",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const {
    finalResult,
    setFinalResult,
    certiId,
    setCertiId,
    prediction,
    setPrediction,
    wallet,
    setWallet,
  } = useStore();

  console.log("f", finalResult);
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useStore();
  const [feedback, setFeedback] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(window.ethereum);
    }
  }, []);

  async function getCerti() {
    // After successful transaction, you can proceed with generating the certificate
    try {
      // Proceed with the transaction
      const tid = "xxxxxxxxxx"; //await sendEth(wallet);
      setLoading(true);
      const res = await fetch(`${baseUrl}mint_certificate/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_uid: finalResult?.fid,
        }),
      });
      const result = await res.json();
      setCertiId(`${baseUrl}certificate/${result.certificate_uid}`);
      console.log(result);
      setLoading(false);
      navigate("/certification");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  const sendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback.");
      return;
    }

    setFeedbackLoading(true);
    try {
      const response = await fetch(`${baseUrl}send-feedback`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_uid: finalResult?.fid,
          feedback: feedback,
        }),
      });

      if (response.ok) {
        toast.success("Feedback submitted successfully! 🎉");
        setIsFeedbackOpen(false);
        setFeedback(""); // Reset feedback input
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong! ❌");
    }
    setFeedbackLoading(false);
  };

  return loading ? (
    <SpinLoader />
  ) : (
    <div className="result-page">
      <div className="result-wrapper">
        <h1 className="result-head">Analysis</h1>
        <div className="result-grid">
          <div className="result-grid-left">
            <img src={`${baseUrl}dwd/${finalResult?.fid}`} alt="" />
          </div>
          <div className="result-grid-right">
            <div className="progress-grp">
              <div className="result-grp">
                <div className="result-grp-name">Fake</div>
                <Progress.Circle
                  percent={Math.round(finalResult?.prediction.fake * 100)}
                  strokeColor={"rgba(132,116,254,1)"}
                  strokeWidth={10}
                  trailWidth={10}
                  style={customProgressBarStyle}
                  strokeLinecap="round"
                  trailColor="rgba(0, 114, 250, 0.09)"
                />
              </div>
              <div className="result-grp">
                <div className="result-grp-name">Real</div>
                <Progress.Circle
                  percent={Math.round(finalResult?.prediction.real * 100)}
                  strokeColor={"rgba(132,116,254,1)"}
                  strokeWidth={10}
                  trailWidth={10}
                  style={customProgressBarStyle}
                  strokeLinecap="round"
                  trailColor="rgba(0, 114, 250, 0.09)"
                />
              </div>
            </div>
            <div className="btns">
              {user != null ? (
                <>
                  <button
                    className="cssbuttons-io-button"
                    onClick={() => getCerti()}
                  >
                    <span>Get Certification</span>
                  </button>
                  <button
                    className="cssbuttons-io-button"
                    onClick={() => setIsFeedbackOpen(true)}
                  >
                    <span>Feedback</span>
                  </button>
                </>
              ) : (
                <button
                  className="cssbuttons-io-button"
                  onClick={() => navigate("/login")}
                >
                  <span>Login To Get Certification</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="feedback-modal">
          <div className="feedback-content">
            <h2>Submit Feedback</h2>
            <textarea
              placeholder="Enter your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="feedback-buttons">
              <button
                className="cssbuttons-io-button"
                onClick={sendFeedback}
                disabled={feedbackLoading}
              >
                {feedbackLoading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="cssbuttons-io-button cancel"
                onClick={() => setIsFeedbackOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResultPage;
