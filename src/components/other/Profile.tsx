import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import Constants from "../../others/constants";
import { UserProfile } from "../../models/userProfile";

export const Profile = () => {
    const navigate = useNavigate();
    const {user, email, ...others}=LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile ?? new UserProfile();
    console.log("User Profile from Local Storage:", {user, email, ...others});
    const doLogout = () => {
        localStorage.removeItem("isUserLoggedIn");
        navigate("/login");
    }

    return (
        <Dropdown className="headerprofile">
        <Dropdown.Toggle className="profiledroupdown" variant="" id="dropdown-profile">
            <span className="profiledroupdown-row">
                <span className="profileicon"><FontAwesomeIcon icon={faCircleUser} /></span>
                <strong className="profilename">
                    {user}
                    <span>{email}</span>
                </strong>
            </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
            {/* <Dropdown.Item>My Project</Dropdown.Item>
            <Dropdown.Item>Message</Dropdown.Item>
            <Dropdown.Item>Notification</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item> */}
            <Dropdown.Item onClick={(e:any)=>doLogout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

    );
}
