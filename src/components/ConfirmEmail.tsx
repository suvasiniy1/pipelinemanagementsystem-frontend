import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserService } from "../services/UserService";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const PROGRESS_DURATION = 3; // seconds
type VerifyState = "loading" | "verified" | "already" | "expired" | "invalid";

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
   const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");
  // Helper function to extract query parameters from the URL
  const getQueryParams = (param: string) => {
    return new URLSearchParams(location.search).get(param);
  };

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const userId = qs.get("userId");
    const token = qs.get("token");

    if (!userId || !token) {
      setState("invalid");
      setMessage("Invalid email confirmation link.");
      setIsLoading(false);                     // ✅ stop spinner
      return;
    }

    (async () => {
      try {
        await userSvc.confirmEmail(userId, token); // throws on 4xx/5xx
        setState("verified");
        setMessage(
          "Your email has been successfully verified. You can now log in and start using your account."
        );
      } catch (err: any) {
        const status = err?.response?.status as number | undefined;
        const apiMsg =
          err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "";

        if (status === 409) {
          setState("already");
          setMessage(apiMsg || "Email already verified.");
        } else if (status === 410) {
          setState("expired");
          setMessage(apiMsg || "This link is invalid or has expired.");
        } else if (status === 400) {
          setState("invalid");
          setMessage(apiMsg || "Invalid confirmation token or link.");
        } else {
          setState("invalid");
          setMessage(
            apiMsg ||
              "We couldn't verify your email. Please request a new verification email or contact support."
          );
        }
      } finally {
        setIsLoading(false);                   // ✅ always stop spinner
      }
    })();
  }, [location.search]);     

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
  const isSuccess = state === "verified";
const isWarning = state === "already";
const palette = isSuccess
  ? { bg: "linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)", fg: "#155724", shadow: "0 4px 24px rgba(67,233,123,0.12)", track: "#e0f7ef", bar: "#43e97b" }
  : isWarning
  ? { bg: "linear-gradient(90deg,#fff3cd 0%,#ffe08a 100%)", fg: "#7a5c00", shadow: "0 4px 24px rgba(255,193,7,0.25)", track: "#fff3cd", bar: "#ffb300" }
  : { bg: "linear-gradient(90deg,#ffdde1 0%,#ee9ca7 100%)", fg: "#d32f2f", shadow: "0 4px 24px rgba(233,67,67,0.12)", track: "#fbeaea", bar: "#e94b4b" };
  const progressPercent = Math.max(
    0,
    100 - (elapsed / PROGRESS_DURATION) * 100
  );
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
    background: palette.bg,
    color: palette.fg,
    boxShadow: palette.shadow,
    borderRadius: 16,
    padding: "32px 40px",
    marginTop: 40,
    textAlign: "center",
    minWidth: 320,
    maxWidth: 420,
  }}
>
  {isSuccess ? (
    <>
      {/* ✅ green check */}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
        <circle cx="12" cy="12" r="12" fill={palette.bar} opacity="0.2" />
        <path d="M7 13l3 3 7-7" stroke={palette.bar} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Email Verified!</h2>
    </>
  ) : isWarning ? (
    <>
      {/* 🟡 info/warning */}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
        <circle cx="12" cy="12" r="12" fill={palette.bar} opacity="0.2" />
        <path d="M12 7.5v1.5M12 11v5" stroke={palette.bar} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Email Already Verified</h2>
    </>
  ) : (
    <>
      {/* ❌ red cross */}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
        <circle cx="12" cy="12" r="12" fill={palette.bar} opacity="0.15" />
        <path d="M9 9l6 6M15 9l-6 6" stroke={palette.bar} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>
        {state === "expired" ? "Link Expired" : "Email Verification Failed"}
      </h2>
    </>
  )}

  <p style={{ fontSize: 18, marginBottom: 16 }}>{message}</p>

  <div style={{ fontSize: 16, color: "#333", marginBottom: 8 }}>
    Redirecting you to the login page in <span style={{ fontWeight: 600 }}>{countdown}</span> second{countdown !== 1 ? "s" : ""}...
  </div>

  <div style={{ width: 120, height: 8, background: palette.track, borderRadius: 4, margin: "0 auto", overflow: "hidden" }}>
    <div style={{ width: `${progressPercent}%`, height: "100%", background: palette.bar, transition: "width 0.05s linear" }} />
  </div>
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