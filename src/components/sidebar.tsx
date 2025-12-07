import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { FaClinicMedical, FaSourcetree, FaNotesMedical, FaProjectDiagram, FaBuilding } from "react-icons/fa";
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
import { useAuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

type params = {
  collapsed: boolean;
};

export const SideBar = (props: params) => {
  const { collapsed } = props;
  const { userRole } = useAuthContext();
  const { currentTheme } = useTheme();
  const location = useLocation();
  const [selectedNavItem, setSelectedNavItem] = useState("pipeline");
  const [toggled, setToggled] = useState(false);

  const compaignSubMenu = ["Template", "Contact", "Campaign", "Email"];
  const adminSubMenu = ["Clinic", "Treatment", "Source", "PipeLineType", "Tenant"];
  const activeNavColor = currentTheme.primaryColor;

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/stages')) setSelectedNavItem('Stages');
    else if (path.includes('/pipeline')) setSelectedNavItem('pipeline');
    else if (path.includes('/activities')) setSelectedNavItem('Activities');
    else if (path.includes('/person')) setSelectedNavItem('Person');
    else if (path.includes('/template')) setSelectedNavItem('Template');
    else if (path.includes('/users')) setSelectedNavItem('Settings');
    else if (path.includes('/clinic')) setSelectedNavItem('Clinic');
    else if (path.includes('/source')) setSelectedNavItem('Source');
    else if (path.includes('/treatment')) setSelectedNavItem('Treatment');
    else if (path.includes('/pipelinetype')) setSelectedNavItem('PipeLineType');
    else if (path.includes('/tenant')) setSelectedNavItem('Tenant');
    else if (path.includes('/reporting')) setSelectedNavItem('Reporting');
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(() => {
      // Target SubMenu icons specifically
      const adminSubMenuIcon = document.querySelector('.ps-submenu-root:has([title="Admin"]) .ps-menu-icon svg');
      const campaignSubMenuIcon = document.querySelector('.ps-submenu-root:has([title="Campaigns"]) .ps-menu-icon svg');
      
      if (adminSubMenu.includes(selectedNavItem) && adminSubMenuIcon) {
        (adminSubMenuIcon as HTMLElement).style.setProperty('color', activeNavColor, 'important');
        (adminSubMenuIcon as HTMLElement).style.setProperty('fill', activeNavColor, 'important');
        (adminSubMenuIcon as HTMLElement).setAttribute('color', activeNavColor);
      }
      
      if (compaignSubMenu.includes(selectedNavItem) && campaignSubMenuIcon) {
        (campaignSubMenuIcon as HTMLElement).style.setProperty('color', activeNavColor, 'important');
        (campaignSubMenuIcon as HTMLElement).style.setProperty('fill', activeNavColor, 'important');
        (campaignSubMenuIcon as HTMLElement).setAttribute('color', activeNavColor);
      }
    }, 100);
  }, [selectedNavItem, activeNavColor, adminSubMenu, compaignSubMenu]);

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

  if (userRole === null || userRole === undefined) return null;

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

        <Menu style={{ paddingTop: "58px" }}>
          <MenuItem hidden={!Util.isAuthorized("Stages")} icon={<HiOutlineFunnel  color={selectedNavItem === "Stages" ? activeNavColor : "black"} />} title="Add Pipeline" component={<Link to="/Stages" />} onClick={() => setSelectedNavItem("Stages")}>
            <b hidden={selectedNavItem !== "Stages"} style={{ color: selectedNavItem === "Stages" ? activeNavColor : "black" }}>Add Pipeline</b>
            <p hidden={selectedNavItem === "Stages"}>Add Pipeline</p>
          </MenuItem>

          <MenuItem hidden={!Util.isAuthorized("pipeline")} icon={<GiStairsGoal  color={selectedNavItem === "pipeline" ? activeNavColor : "black"} />} title="Sales Stage" component={<Link to="/pipeline" />} onClick={() => setSelectedNavItem("pipeline")}>
            <b hidden={selectedNavItem !== "pipeline"} style={{ color: selectedNavItem === "pipeline" ? activeNavColor : "black" }}>Sales Stage</b>
            <p hidden={selectedNavItem === "pipeline"}>Sales Stage</p>
          </MenuItem>

          <MenuItem hidden={!Util.isAuthorized("Activities")} icon={<RxActivityLog color={selectedNavItem === "Activities" ? activeNavColor : "black"} />} title="Activities" component={<Link to="/Activities" />} onClick={() => setSelectedNavItem("Activities")}>
            <b hidden={selectedNavItem !== "Activities"} style={{ color: selectedNavItem === "Activities" ? activeNavColor : "black" }}>Activities</b>
            <p hidden={selectedNavItem === "Activities"}>Activities</p>
          </MenuItem>

          <MenuItem hidden={!Util.isAuthorized("Person")} icon={<RiContactsBookFill color={selectedNavItem === "Person" ? activeNavColor : "black"} />} title="Persons" component={<Link to="/Person" />} onClick={() => setSelectedNavItem("Person")}>
            <b hidden={selectedNavItem !== "Person"} style={{ color: selectedNavItem === "Person" ? activeNavColor : "black" }}>Persons</b>
            <p hidden={selectedNavItem === "Person"}>Persons</p>
          </MenuItem>

          <SubMenu icon={<MdCampaign color={compaignSubMenu.includes(selectedNavItem) ? activeNavColor : "black"} />} hidden={!Util.isAuthorized("Template")} defaultOpen={compaignSubMenu.includes(selectedNavItem)} title="Campaigns" label="Campaigns" style={{ color: compaignSubMenu.includes(selectedNavItem) ? activeNavColor : "black" }}>
            <MenuItem hidden={!Util.isAuthorized("Template")} title="Template" component={<Link to="/Template" />} onClick={() => setSelectedNavItem("Template")} icon={<HiTemplate color={selectedNavItem === "Template" ? activeNavColor : "black"} />}>
              <b hidden={selectedNavItem !== "Template"} style={{ color: selectedNavItem === "Template" ? activeNavColor : "black" }}>Template</b>
              <p hidden={selectedNavItem === "Template"}>Template</p>
            </MenuItem>
            {/*<MenuItem hidden={!Util.isAuthorized("Email")} component={<Link to="/Email" />} onClick={() => setSelectedNavItem("Email")} icon={<MdEmail color={selectedNavItem === "Email" ? activeNavColor : "black"} />}>Email</MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Campaigns")} component={<Link to="/Campaigns" />} onClick={() => setSelectedNavItem("Campaign")} icon={<MdCampaign color={selectedNavItem === "Campaign" ? activeNavColor : "black"} />}>Campaign</MenuItem>*/}
          </SubMenu>

          <MenuItem hidden={!Util.isAuthorized("users")} title="Settings" component={<Link to="/users" />} onClick={() => setSelectedNavItem("Settings")} icon={<IoSettings color={selectedNavItem === "Settings" ? activeNavColor : "black"} />}>
            <b hidden={selectedNavItem !== "Settings"} style={{ color: selectedNavItem === "Settings" ? activeNavColor : "black" }}>Manage User</b>
            <p hidden={selectedNavItem === "Settings"}>Manage User</p>
          </MenuItem>

          <MenuItem hidden={userRole !== 0} title="Tenants" component={<Link to="/Tenant" />} onClick={() => setSelectedNavItem("Tenant")} icon={<FaBuilding color={selectedNavItem === "Tenant" ? activeNavColor : "black"} />}>
            <b hidden={selectedNavItem !== "Tenant"} style={{ color: selectedNavItem === "Tenant" ? activeNavColor : "black" }}>Tenants</b>
            <p hidden={selectedNavItem === "Tenant"}>Tenants</p>
          </MenuItem>

          <SubMenu icon={<RiAdminFill color={adminSubMenu.includes(selectedNavItem) ? activeNavColor : "black"} />} hidden={userRole === 0 || !Util.isAuthorized("Admin")} defaultOpen={adminSubMenu.includes(selectedNavItem)} title="Admin" label="Admin" style={{ color: adminSubMenu.includes(selectedNavItem) ? activeNavColor : "black" }}>
            <MenuItem hidden={!Util.isAuthorized("Clinic")} title="Clinic" component={<Link to="/Clinic" />} onClick={() => setSelectedNavItem("Clinic")} icon={<FaClinicMedical color={selectedNavItem === "Clinic" ? activeNavColor : "black"} />}>
              <b hidden={selectedNavItem !== "Clinic"} style={{ color: selectedNavItem === "Clinic" ? activeNavColor : "black" }}>Clinic</b>
              <p hidden={selectedNavItem === "Clinic"}>Clinic</p>
            </MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Source")} title="Source" component={<Link to="/Source" />} onClick={() => setSelectedNavItem("Source")} icon={<BiGitBranch color={selectedNavItem === "Source" ? activeNavColor : "black"} />}>
              <b hidden={selectedNavItem !== "Source"} style={{ color: selectedNavItem === "Source" ? activeNavColor : "black" }}>Source</b>
              <p hidden={selectedNavItem === "Source"}>Source</p>
            </MenuItem>
            <MenuItem hidden={!Util.isAuthorized("Treatment")} title="Treatment" component={<Link to="/Treatment" />} onClick={() => setSelectedNavItem("Treatment")} icon={<FaNotesMedical color={selectedNavItem === "Treatment" ? activeNavColor : "black"} />}>
              <b hidden={selectedNavItem !== "Treatment"} style={{ color: selectedNavItem === "Treatment" ? activeNavColor : "black" }}>Treatment</b>
              <p hidden={selectedNavItem === "Treatment"}>Treatment</p>
            </MenuItem>
            <MenuItem hidden={!Util.isAuthorized("PipeLineType")} title="Pipeline Type" component={<Link to="/PipeLineType" />} onClick={() => setSelectedNavItem("PipeLineType")} icon={<FaProjectDiagram color={selectedNavItem === "PipeLineType" ? activeNavColor : "black"} />}>
              <b hidden={selectedNavItem !== "PipeLineType"} style={{ color: selectedNavItem === "PipeLineType" ? activeNavColor : "black" }}>Pipeline Type</b>
              <p hidden={selectedNavItem === "PipeLineType"}>Pipeline Type</p>
            </MenuItem>

          </SubMenu>

          <MenuItem hidden={!Util.isAuthorized("Reporting")} title="Reporting" component={<Link to="/Reporting" />} onClick={() => setSelectedNavItem("Reporting")} icon={<RiDashboard2Fill color={selectedNavItem === "Reporting" ? activeNavColor : "black"} />}>
            <b hidden={selectedNavItem !== "Reporting"} style={{ color: selectedNavItem === "Reporting" ? activeNavColor : "black" }}>Reporting</b>
            <p hidden={selectedNavItem === "Reporting"}>Reporting</p>
          </MenuItem>

        
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
  background: "#3dc2c0",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
