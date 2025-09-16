import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { UserProfile } from "../../models/userProfile";

export const Profile = () => {
    const navigate = useNavigate();
    const { userProfile, setIsLoggedIn } = useAuthContext();
    
    const { user, email } = userProfile || new UserProfile();
    const doLogout = async () => {
        setIsLoggedIn(false);
        navigate("/login", { replace: true });
    };
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
