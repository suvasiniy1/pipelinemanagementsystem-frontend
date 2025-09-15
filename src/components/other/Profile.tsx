import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../others/LocalStorageUtil";
import Constants from "../../others/constants";
import { UserProfile } from "../../models/userProfile";
import { useEffect } from "react";

export const Profile = () => {
    const navigate = useNavigate();
   // const {user, email, ...others}=LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile ?? new UserProfile();
   // Keep backwards compatibility: still read role from LS
  const stored =
    (LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile) ??
    new UserProfile();
  const { user, email, role } = stored;
   // console.log("User Profile from Local Storage:", { user, email, role, ...others });
   // ✅ Self-heal role from server once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) return;
        const me = await res.json(); // { name, email, role, ... }
        if (cancelled) return;
        if (me?.role && me.role !== role) {
          LocalStorageUtil.setItemObject(Constants.USER_PROFILE, {
            ...stored,
            role: me.role,
          });
          // Let the rest of the app know it changed (if they cache user)
          window.dispatchEvent(new Event("userprofile:role-sync"));
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔒 Optional: revert live tampering in another tab / DevTools
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== Constants.USER_PROFILE) return;
      // whenever USER_PROFILE changes, re-check with server
      fetch("/api/me", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((me) => {
          if (!me?.role) return;
          const current =
            (LocalStorageUtil.getItemObject(
              Constants.USER_PROFILE
            ) as UserProfile) ?? new UserProfile();
          if (current.role !== me.role) {
            LocalStorageUtil.setItemObject(Constants.USER_PROFILE, {
              ...current,
              role: me.role,
            });
            window.dispatchEvent(new Event("userprofile:role-sync"));
          }
        })
        .catch(() => {});
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
    const doLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem(Constants.USER_PROFILE);
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
