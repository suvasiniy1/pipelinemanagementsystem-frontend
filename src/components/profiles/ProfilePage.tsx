import React, { useEffect, useState } from "react";
import { UserProfile } from "../../models/userProfile";
import "./ProfilePage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Util from "../../others/util";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";




export const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        // Get user profile from localStorage using Util.UserProfile()
        const utilProfile = Util.UserProfile();
        
        if (utilProfile && Object.keys(utilProfile).length > 0) {
          setUserProfile(utilProfile);
          // Set MFA status from profile or default to false
          setIsTwoFactorEnabled(utilProfile.twoFactorEnabled || false);
        } else {
          // Fallback: create a basic profile structure
          const fallbackProfile: UserProfile = {
            firstName: "User",
            lastName: "Profile",
            phoneNumber: "N/A",
            user: "user",
            email: "user@example.com",
            token: "",
            password: "",
            userId: 0,
            isactive: true,
            visibilityGroupID: 0,
            expires: "",
            country: "United Kingdom",
            state: "N/A",
            language: "English",
            timeZone: "Europe/London",
            profilePicture: ""
          };
          setUserProfile(fallbackProfile);
          setIsTwoFactorEnabled(false);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        // Set fallback profile on error
        const fallbackProfile: UserProfile = {
          firstName: "User",
          lastName: "Profile",
          phoneNumber: "N/A",
          user: "user",
          email: "user@example.com",
          token: "",
          password: "",
          userId: 0,
          isactive: true,
          visibilityGroupID: 0,
          expires: "",
          country: "United Kingdom",
          state: "N/A",
          language: "English",
          timeZone: "Europe/London",
          profilePicture: ""
        };
        setUserProfile(fallbackProfile);
        setIsTwoFactorEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
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

  const handleMFAToggle = () => {
    const newMFAStatus = !isTwoFactorEnabled;
    setIsTwoFactorEnabled(newMFAStatus);
    
    // Update the profile in localStorage
    if (userProfile) {
      const updatedProfile = { ...userProfile, twoFactorEnabled: newMFAStatus };
      localStorage.setItem('UserProfile', JSON.stringify(updatedProfile));
      toast.success(`Two-Factor Authentication ${newMFAStatus ? 'enabled' : 'disabled'} successfully!`);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (!userProfile) {
    return <p>User profile could not be loaded.</p>;
  }

  return (
    <div className="profile-page">
      <div className="w-100" style={{ maxWidth: '1100px' }}>
        <Button 
          variant="outline-primary" 
          className="mb-4 d-flex align-items-center gap-2" 
          onClick={() => navigate("/pipeline")}
          style={{ width: 'fit-content' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Deals
        </Button>
      </div>
      <h1 className="profile-title"></h1>
      <div className="profile-container">
       
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
            <div className="d-flex align-items-center gap-3">
              <Form.Check
                type="switch"
                id="mfa-switch"
                checked={isTwoFactorEnabled}
                onChange={handleMFAToggle}
                label={isTwoFactorEnabled ? "Enabled" : "Disabled"}
              />
              <Button
                variant={isTwoFactorEnabled ? "success" : "outline-secondary"}
                size="sm"
                onClick={handleMFAToggle}
              >
                {isTwoFactorEnabled ? "Disable MFA" : "Enable MFA"}
              </Button>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
