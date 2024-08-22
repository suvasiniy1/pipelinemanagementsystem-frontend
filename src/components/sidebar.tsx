import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { MdCampaign, MdEmail, MdLocalOffer } from "react-icons/md";
import { RiAdminFill, RiContactsBookFill } from "react-icons/ri";
import { RxActivityLog } from "react-icons/rx";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Header } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";
import jpg from "../../src/resources/images/logo.jpg";
import png from "../../src/resources/images/y1.png";

type params = {
  collapsed: boolean;
};
export const SideBar = (props: params) => {
  const { collapsed, ...others } = props;
  const [selectedNavItem, setSelectedNavItem] = useState("pipeline");
  const [toggled, setToggled] = useState(false);
  const compaignSubMenu = ["Template", "Contact", "Campaign", "Email"];

  const themes: any = {
    light: {
      sidebar: {
        backgroundColor: "#ffffff",
        color: "#607489",
      },
      menu: {
        menuContent: "#fbfcfd",
        icon: "#0098e5",
        hover: {
          backgroundColor: "#c5e4ff",
          color: "#44596e",
        },
        disabled: {
          color: "#9fb6cf",
        },
      },
    },
    dark: {
      sidebar: {
        backgroundColor: "white",
        color: "black",
      },
      menu: {
        menuContent: "#FFFFFF",
        icon: "#59d0ff",
        hover: {
          backgroundColor: "#21232c",
          color: "#21232c",
        },
        disabled: {
          color: "#3e5e7e",
        },
      },
    },
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const Drawer = () => {
    return (
      <>
        {/* <HandleIdleTime /> */}
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          width="180"
          transitionDuration={500}
          backgroundColor={hexToRgba(themes.dark.sidebar.backgroundColor, 1)}
          rootStyles={{
            color: themes.dark.sidebar.color,
          }}
        >
          <Header className="sidenavhead">
            {<img className="sideopenlogo" src={jpg} />}
            {<img className="sidehidelogo" src={png} />}
          </Header>
          <Menu style={{paddingTop:"60px"}}>
            <MenuItem
              icon={<FaDollarSign />}
              component={<Link to="/Stages" />}
              onClick={(e: any) => setSelectedNavItem("Stages")}
            >
              <b hidden={selectedNavItem != "Stages"}>Stages</b>
              <p hidden={selectedNavItem == "Stages"}>Stages</p>
            </MenuItem>
            <MenuItem
              icon={<MdLocalOffer />}
              component={<Link to="/pipeline" />}
              onClick={(e: any) => setSelectedNavItem("pipeline")}
            >
              <b hidden={selectedNavItem != "pipeline"}>Deals</b>
              <p hidden={selectedNavItem == "pipeline"}>Deals</p>
            </MenuItem>
            <MenuItem
              icon={<RxActivityLog />}
              component={<Link to="/Activities" />}
              onClick={(e: any) => setSelectedNavItem("Activities")}
            >
              <b hidden={selectedNavItem != "Activities"}>Activities</b>
              <p hidden={selectedNavItem == "Activities"}>Activities</p>
            </MenuItem>
            <MenuItem
              icon={<RiContactsBookFill />}
              component={<Link to="/Person" />}
              onClick={(e: any) => setSelectedNavItem("Person")}
            >
             Persons
            </MenuItem>
            <SubMenu icon={<MdCampaign />} defaultOpen={compaignSubMenu.includes(selectedNavItem)} label="Campaigns">
              <MenuItem
                icon={<HiTemplate />}
                component={<Link to="/Template" />}
                onClick={(e: any) => setSelectedNavItem("Template")}
              >
              <b hidden={selectedNavItem != "Template"}>Template</b>
              <p hidden={selectedNavItem == "Template"}>Template</p>
              </MenuItem>
              <MenuItem
                icon={<RiContactsBookFill />}
                component={<Link to="/Contact" />}
                onClick={(e: any) => setSelectedNavItem("Contact")}
              >
              <b hidden={selectedNavItem != "Contact"}>Contact</b>
              <p hidden={selectedNavItem == "Contact"}>Contact</p>
              </MenuItem>
              <MenuItem
                icon={<MdEmail />}
                component={<Link to="/Email" />}
                onClick={(e: any) => setSelectedNavItem("Email")}
              >
              <b hidden={selectedNavItem != "Email"}>Email</b>
              <p hidden={selectedNavItem == "Email"}>Email</p>
              </MenuItem>
              <MenuItem
                icon={<MdCampaign />}
                component={<Link to="/Campaigns" />}
                onClick={(e: any) => setSelectedNavItem("Campaign")}
              >
              <b hidden={selectedNavItem != "Campaign"}>Campaign</b>
              <p hidden={selectedNavItem == "Campaign"}>Campaign</p>
              </MenuItem>
            </SubMenu>
            <MenuItem
              icon={<IoSettings />}
              component={<Link to="/users" />}
              onClick={(e: any) => setSelectedNavItem("Settings")}
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={<RiAdminFill />}
              component={<Link to="/Admin" />}
              onClick={(e: any) => setSelectedNavItem("Admin")}
            >
              Admin
            </MenuItem>
          </Menu>
        </Sidebar>
      </>
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
