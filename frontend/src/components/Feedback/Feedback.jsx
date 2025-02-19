// FeedbackPopup.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import "./Feedback.scss";

const FeedbackPopup = ({ popUp, setPopup }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ fileUid, feedback });
    setPopup(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={() => setPopup(false)} className="close-button">
          <X size={20} />
        </button>

        <h2 className="popup-title">Provide Feedback</h2>

        {/* <div className="file-uid-container">
          <label className="input-label">File UID</label>
          <div className="file-uid">{fileUid}</div>
        </div> */}

        <form onSubmit={handleSubmit}>
          <div className="feedback-input-container">
            <label htmlFor="feedback" className="input-label">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="feedback-textarea"
              placeholder="Please enter your feedback here..."
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
