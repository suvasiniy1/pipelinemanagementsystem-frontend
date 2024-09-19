import React, { useEffect, useState } from "react";
import { UserService } from "../../services/UserService";
import { UserProfile } from "../../models/userProfile";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import Constants from "../../others/constants";
import { AxiosError } from "axios";
import { UnAuthorized } from "../../common/unauthorized";
import "./ProfilePage.css"; // Import the CSS file for styling
import { AccountService } from "../../services/accountService"; 
import { toast } from "react-toastify";



export const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false); // Added state for 2FA
  const [loading2FA, setLoading2FA] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileData = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile ?? new UserProfile();
        const userId = userProfileData.userId;

        if (!userId) {
          throw new Error("No user ID found.");
        }

        const userSvc = new UserService(null);
        const response = await userSvc.getUserById(userId);

        if (response) {
          const userData = response;
          setUserProfile({
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            user: userData.userName,
            email: userData.email,
            token: userData.token || "",
            password: userData.password || "",
            userId: userData.userId || 0,
            isactive: userData.isactive !== undefined ? userData.isactive : false,
            visibilityGroupID: userData.visibilityGroupID || 0,
            expires: userData.expires || "",
            country: userData.country || "United Kingdom",
            state: userData.state || "N/A",
            language: userData.language || "English",
            timeZone: userData.timeZone || "Europe/London",
            profilePicture: userData.profilePicture || "",
          });
          setIsTwoFactorEnabled(userData.twoFactorEnabled); // Set the initial 2FA state
        } else {
          throw new Error("No data returned from API");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err as AxiosError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: userProfile?.timeZone || "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const timeString = new Intl.DateTimeFormat("en-GB", options).format(new Date());
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // Update time every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userProfile]);

  const handleTwoFactorToggle = async () => {
    setLoading2FA(true);
    const accountSvc = new AccountService(null); // Create an instance of AccountService
    try {
      const response = await accountSvc.enableTwoFactorAuthentication(); // Call the API to enable 2FA
  
      console.log("2FA Enable Response: ", response);
  
      if (response === "Two-Factor Authentication has been enabled.") {
        setIsTwoFactorEnabled(true);
        setMessage("Two-Factor Authentication has been enabled.");  // Set the success message
      } else {
        setMessage("Failed to enable Two-Factor Authentication.");
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      setMessage("An error occurred while enabling Two-Factor Authentication.");
    } finally {
      setLoading2FA(false);
    }
  };
  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <UnAuthorized error={error} />;

  if (!userProfile) {
    return <p>User profile could not be loaded.</p>;
  }

  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-container">
        <button className="edit-button">Edit</button>
        <div className="profile-header">
          <div
            className="profile-picture"
            style={{ backgroundImage: userProfile.profilePicture ? `url(${userProfile.profilePicture})` : undefined }}
          >
            {!userProfile.profilePicture && (
              <span className="profile-initials">
                {`${userProfile.firstName?.charAt(0) || ""}${userProfile.lastName?.charAt(0) || ""}`}
              </span>
            )}
          </div>
          <div className="profile-header-info">
            <h2>{`${userProfile.firstName || "Full"} ${userProfile.lastName || "Name"}`}</h2>
            <p className="email">{userProfile.email || "email@example.com"}</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="profile-item">
            <strong>Full Name</strong>
            <p>{`${userProfile.firstName || "Julia"} ${userProfile.lastName || "Turner"}`}</p>
          </div>
          <div className="profile-item">
            <strong>Display Name</strong>
            <p>{userProfile.user || "user"}</p>
          </div>
          <div className="profile-item">
            <strong>Email</strong>
            <p>{userProfile.email || "user@gmail.com"}</p>
          </div>
          <div className="profile-item">
            <strong>Phone Number</strong>
            <p>{userProfile.phoneNumber || "09876545678"}</p>
          </div>
          <div className="profile-item">
            <strong>Country/Region</strong>
            <p>
              <img
                src="https://flagcdn.com/gb.svg"
                alt="UK Flag"
                className="country-flag"
              />
              {userProfile.country || "United Kingdom"}
            </p>
          </div>
          <div className="profile-item">
            <strong>Language</strong>
            <p>{userProfile.language || "English"}</p>
          </div>
          <div className="profile-item">
            <strong>Current Time</strong>
            <p>{currentTime}</p>
          </div>
          <div className="profile-item">
            <strong>Two-Factor Authentication</strong>
            {isTwoFactorEnabled ? (
              <p>Two-Factor Authentication is enabled</p>
            ) : (
              <button onClick={handleTwoFactorToggle} disabled={loading2FA}>
                {loading2FA ? 'Enabling...' : 'Enable Two-Factor Authentication'}
              </button>
            )}
          </div>
          <p>{message}</p> {/* Display any message or error */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
