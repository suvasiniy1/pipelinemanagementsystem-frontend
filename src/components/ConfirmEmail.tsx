import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const PROGRESS_DURATION = 3; // seconds

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorHandler = (error: any) => {
    console.error("An error occurred:", error);
    toast.error("An unexpected error occurred.");
  };
  const userSvc = new UserService(errorHandler);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [success, setSuccess] = useState(false);

  // Helper function to extract query parameters from the URL
  const getQueryParams = (param: string) => {
    return new URLSearchParams(location.search).get(param);
  };

  useEffect(() => {
    // Extract userId and token from the query parameters in the URL
    const userId = getQueryParams("userId");
    const token = getQueryParams("token");

    if (!userId || !token) {
      setConfirmationMessage("Invalid email confirmation link.");
      setIsLoading(false);
      return;
    }

    // Call the API to confirm the email
    userSvc
      .confirmEmail(userId, token)
      .then((response) => {
        if (response) {
          setConfirmationMessage("Your email has been verified!");
          setSuccess(true);
          //   toast.success("Email confirmed successfully.");
        } else {
          setSuccess(false);
          setConfirmationMessage("Email confirmation failed.");
          //   toast.error("Email confirmation failed.");
        }
      })
      .catch((error) => {
        console.error("Email confirmation error:", error);
        setSuccess(false);
        setConfirmationMessage("An error occurred during email confirmation.");
        // toast.error("An error occurred during email confirmation.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.search, userSvc]);

  // Countdown and redirect effect with smooth progress
  useEffect(() => {
    if (!isLoading) {
      if (elapsed < PROGRESS_DURATION) {
        const interval = setInterval(() => {
          setElapsed((prev) => prev + 0.05);
        }, 50);
        return () => clearInterval(interval);
      } else {
        navigate("/login");
      }
    }
  }, [isLoading, elapsed, navigate]);

  // Show loading spinner or confirmation message
  if (isLoading) {
    return (
      <div className="alignCenter">
        <Spinner />
      </div>
    );
  }

  const progressPercent = Math.max(0, 100 - (elapsed / PROGRESS_DURATION) * 100);
  const countdown = Math.ceil(PROGRESS_DURATION - elapsed);

  return (
    <div
      style={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: success
            ? "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
            : "linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)",
          color: success ? "#155724" : "#d32f2f",
          borderRadius: 16,
          padding: "32px 40px",
          boxShadow: success
            ? "0 4px 24px rgba(67,233,123,0.12)"
            : "0 4px 24px rgba(233,67,67,0.12)",
          marginTop: 40,
          textAlign: "center",
          animation: "fadeInScale 0.7s",
          position: "relative",
          minWidth: 320,
        }}
      >
        {success ? (
          <>
            <svg
              width="64"
              height="64"
              fill="none"
              viewBox="0 0 24 24"
              style={{ marginBottom: 16 }}
            >
              <circle cx="12" cy="12" r="12" fill="#43e97b" fillOpacity="0.2" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#43e97b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>
              Email Verified!
            </h2>
            <p style={{ fontSize: 18, marginBottom: 16 }}>
              {confirmationMessage}
            </p>
            <div style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
              Redirecting you to the login page in{" "}
              <span style={{ fontWeight: 600 }}>{countdown}</span> second
              {countdown !== 1 ? "s" : ""}...
            </div>
            <div
              style={{
                width: 120,
                height: 8,
                background: "#e0f7ef",
                borderRadius: 4,
                margin: "0 auto",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "#43e97b",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          </>
        ) : (
          <>
            <svg
              width="64"
              height="64"
              fill="none"
              viewBox="0 0 24 24"
              style={{ marginBottom: 16 }}
            >
              <circle cx="12" cy="12" r="12" fill="#e94b4b" fillOpacity="0.15" />
              <path
                d="M9 9l6 6M15 9l-6 6"
                stroke="#e94b4b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>
              Email Verification Failed
            </h2>
            <p style={{ fontSize: 18, marginBottom: 16 }}>{confirmationMessage}</p>
            <div style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
              Redirecting you to the login page in{" "}
              <span style={{ fontWeight: 600 }}>{countdown}</span> second
              {countdown !== 1 ? "s" : ""}...
            </div>
            <div
              style={{
                width: 120,
                height: 8,
                background: "#fbeaea",
                borderRadius: 4,
                margin: "0 auto",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "#e94b4b",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmEmail;
