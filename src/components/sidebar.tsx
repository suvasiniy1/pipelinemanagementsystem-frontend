import { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { FaClinicMedical, FaSourcetree, FaNotesMedical, FaProjectDiagram } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdCampaign, MdEmail, MdLocalOffer } from "react-icons/md";
import {
  RiAdminFill,
  RiContactsBookFill,
  RiDashboard2Fill,
  RiMenuSearchFill,
} from "react-icons/ri";
import { RxActivityLog } from "react-icons/rx";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Header } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";
import jpg from "../../src/resources/images/logo.jpg";
import png from "../../src/resources/images/y1.png";
import logo from "../../src/resources/images/Clinic-Lead-White.png";
import logoicon from "../../src/resources/images/Clinic-Lead-White-Icon.png";
import Util from "../others/util";
import { BiGitBranch } from "react-icons/bi";
import { HiOutlineFunnel } from "react-icons/hi2";
import { GiStairsGoal } from "react-icons/gi";

type params = {
  collapsed: boolean;
};

export const SideBar = (props: params) => {
  const { collapsed } = props;
  const [selectedNavItem, setSelectedNavItem] = useState("pipeline");
  const [toggled, setToggled] = useState(false);
  const [navReady, setNavReady] = useState(false); // ✅ NEW

  const compaignSubMenu = ["Template", "Contact", "Campaign", "Email"];
  const adminSubMenu = ["Clinic", "Treatment", "Source", "PipeLineType"];
  const activeNavColor = window.config.NavItemActiveColor;

  // ✅ Setup nav access on mount
  useEffect(() => {
    const profile = Util.UserProfile();
    if (profile?.role) {
      Util.loadNavItemsForUser(parseInt(profile.role));
      setNavReady(true);
    }
  }, []);

  const themes: any = {
    dark: {
      sidebar: {
        backgroundColor: "white",
        color: "black",
      },
    },
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (!navReady) return null;

  const Drawer = () => {
    return (
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        width="180"
        transitionDuration={500}
        backgroundColor={hexToRgba(themes.dark.sidebar.backgroundColor, 1)}
        rootStyles={{ color: themes.dark.sidebar.color }}
      >
        <Header className="sidenavhead">
          <img className="sideopenlogo" src={logo} style={{ display: !collapsed ? "block" : "none", width: "100%", height:"auto" }} />
          <img className="sidehidelogo" src={logoicon} style={{ display: collapsed ? "block" : "none", width: "28px", height:"auto", left:"10px", top:"15px" }} />
        </Header>

        <Menu style={{ paddingTop: "60px" }}>
          <MenuItem hidden={!Util.isAuthorized("Stages")} icon={<HiOutlineFunnel  color={selectedNavItem === "Stages" ? activeNavColor : "black"} />} component={<Link to="/Stages" />} onClick={() => setSelectedNavItem("Stages")}>
            <b hidden={selectedNavItem !== "Stages"} style={{ color: selectedNavItem === "Stages" ? activeNavColor : "black" }}>Add Pipeline</b>
            <p hidden={selectedNavItem === "Stages"}>Add Pipeline</p>
          </MenuItem>

          <MenuItem hidden={!Util.isAuthorized("pipeline")} icon={<GiStairsGoal  color={selectedNavItem === "pipeline" ? activeNavColor : "black"} />} component={<Link to="/pipeline" />} onClick={() => setSelectedNavItem("pipeline")}>
            <b hidden={selectedNavItem !== "pipeline"} style={{ color: selectedNavItem === "pipeline" ? activeNavColor : "black" }}>Sales Stage</b>
            <p hidden={selectedNavItem === "pipeline"}>Sales Stage</p>
          </MenuItem>

          <MenuItem hidden={!Util.isAuthorized("Activities")} icon={<RxActivityLog color={selectedNavItem === "Activities" ? activeNavColor : "black"} />} component={<Link to="/Activities" />} onClick={() => setSelectedNavItem("Activities")}>
            <b hidden={selectedNavItem !== "Activities"} style={{ color: selectedNavItem === "Activities" ? activeNavColor : "black" }}>Activities</b>
            <p hidden={selectedNavItem === "Activities"}>Activities</p>
          </MenuItem>

          <MenuItem hidden={!Util.isAuthorized("Person")} icon={<RiContactsBookFill color={selectedNavItem === "Person" ? activeNavColor : "black"} />} component={<Link to="/Person" />} onClick={() => setSelectedNavItem("Person")}>
            <b hidden={selectedNavItem !== "Person"} style={{ color: selectedNavItem === "Person" ? activeNavColor : "black" }}>Persons</b>
            <p hidden={selectedNavItem === "Person"}>Persons</p>
          </MenuItem>

          <SubMenu icon={<MdCampaign color={compaignSubMenu.includes(selectedNavItem) ? activeNavColor : "black"} />} hidden={!Util.isAuthorized("Template")} defaultOpen={compaignSubMenu.includes(selectedNavItem)} label="Campaigns">
            <MenuItem hidden={!Util.isAuthorized("Template")} component={<Link to="/Template" />} onClick={() => setSelectedNavItem("Template")} icon={<HiTemplate color={selectedNavItem === "Template" ? activeNavColor : "black"} />}>Template</MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Email")} component={<Link to="/Email" />} onClick={() => setSelectedNavItem("Email")} icon={<MdEmail color={selectedNavItem === "Email" ? activeNavColor : "black"} />}>Email</MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Campaigns")} component={<Link to="/Campaigns" />} onClick={() => setSelectedNavItem("Campaign")} icon={<MdCampaign color={selectedNavItem === "Campaign" ? activeNavColor : "black"} />}>Campaign</MenuItem>
          </SubMenu>

          <MenuItem hidden={!Util.isAuthorized("users")} component={<Link to="/users" />} onClick={() => setSelectedNavItem("Settings")} icon={<IoSettings color={selectedNavItem === "Settings" ? activeNavColor : "black"} />}>Manage User</MenuItem>

          <SubMenu icon={<RiAdminFill color={adminSubMenu.includes(selectedNavItem) ? activeNavColor : "black"} />} hidden={!Util.isAuthorized("Admin")} defaultOpen={adminSubMenu.includes(selectedNavItem)} label="Admin">
            <MenuItem hidden={!Util.isAuthorized("Clinic")} component={<Link to="/Clinic" />} onClick={() => setSelectedNavItem("Clinic")} icon={<FaClinicMedical color={selectedNavItem === "Clinic" ? activeNavColor : "black"} />}>Clinic</MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Source")} component={<Link to="/Source" />} onClick={() => setSelectedNavItem("Source")} icon={<BiGitBranch color={selectedNavItem === "Source" ? activeNavColor : "black"} />}>Source</MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Treatment")} component={<Link to="/Treatment" />} onClick={() => setSelectedNavItem("Treatment")} icon={<FaNotesMedical color={selectedNavItem === "Treatment" ? activeNavColor : "black"} />}>Treatment</MenuItem>
            <MenuItem hidden={!Util.isAuthorized("PipeLineType")} component={<Link to="/PipeLineType" />} onClick={() => setSelectedNavItem("PipeLineType")} icon={<FaProjectDiagram color={selectedNavItem === "PipeLineType" ? activeNavColor : "black"} />}>Pipeline Type</MenuItem>
          </SubMenu>

          <MenuItem hidden={!Util.isAuthorized("Reporting")} component={<Link to="/Reporting" />} onClick={() => setSelectedNavItem("Reporting")} icon={<RiDashboard2Fill color={selectedNavItem === "Reporting" ? activeNavColor : "black"} />}>Reporting</MenuItem>

        
        </Menu>
      </Sidebar>
    );
  };

  return <Drawer />;
};

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: "#34c3ff",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
