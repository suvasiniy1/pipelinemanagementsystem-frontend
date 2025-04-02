import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";
import { FaSourcetree } from "react-icons/fa";
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
import Util from "../others/util";
import { FaProjectDiagram } from "react-icons/fa";
import { BiGitBranch } from "react-icons/bi";
import { FaNotesMedical } from "react-icons/fa";

type params = {
  collapsed: boolean;
};
export const SideBar = (props: params) => {
  const { collapsed, ...others } = props;
  const [selectedNavItem, setSelectedNavItem] = useState("pipeline");
  const [toggled, setToggled] = useState(false);
  const compaignSubMenu = ["Template", "Contact", "Campaign", "Email"];
  const adminSubMenu = ["Clinic", "Treatment", "Source","PipeLineType"];
  const activeNavColor = window.config.NavItemActiveColor;

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
          <Menu style={{ paddingTop: "60px" }}>
            <MenuItem
              hidden={!Util.isAuthorized("Stages")}
              icon={
                <FaDollarSign
                  className="active"
                  color={
                    selectedNavItem === "Stages" ? activeNavColor : "black"
                  }
                />
              }
              component={<Link to="/Stages" />}
              onClick={(e: any) => setSelectedNavItem("Stages")}
            >
              <b
                hidden={selectedNavItem != "Stages"}
                style={{
                  color:
                    selectedNavItem === "Stages" ? activeNavColor : "black",
                }}
              >
                Stages
              </b>
              <p hidden={selectedNavItem == "Stages"}>Stages</p>
            </MenuItem>
            <MenuItem
              icon={
                <MdLocalOffer
                  color={
                    selectedNavItem === "pipeline" ? activeNavColor : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("pipeline")}
              component={<Link to="/pipeline" />}
              onClick={(e: any) => setSelectedNavItem("pipeline")}
            >
              <b
                hidden={selectedNavItem != "pipeline"}
                style={{
                  color:
                    selectedNavItem === "pipeline" ? activeNavColor : "black",
                }}
              >
                Deals
              </b>
              <p hidden={selectedNavItem == "pipeline"}>Deals</p>
            </MenuItem>
            <MenuItem
              icon={
                <RxActivityLog
                  color={
                    selectedNavItem === "Activities" ? activeNavColor : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("Activities")}
              component={<Link to="/Activities" />}
              onClick={(e: any) => setSelectedNavItem("Activities")}
            >
              <b
                hidden={selectedNavItem != "Activities"}
                style={{
                  color:
                    selectedNavItem === "Activities" ? activeNavColor : "black",
                }}
              >
                Activities
              </b>
              <p hidden={selectedNavItem == "Activities"}>Activities</p>
            </MenuItem>
            <MenuItem
              icon={
                <RiContactsBookFill
                  color={
                    selectedNavItem === "Person" ? activeNavColor : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("Person")}
              component={<Link to="/Person" />}
              onClick={(e: any) => setSelectedNavItem("Person")}
            >
              <b
                hidden={selectedNavItem != "Person"}
                style={{
                  color:
                    selectedNavItem === "Person" ? activeNavColor : "black",
                }}
              >
                Persons
              </b>
              <p hidden={selectedNavItem == "Person"}>Persons</p>
            </MenuItem>
            <SubMenu
              icon={
                <MdCampaign
                  color={
                    compaignSubMenu.includes(selectedNavItem)
                      ? activeNavColor
                      : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("Template")}
              defaultOpen={compaignSubMenu.includes(selectedNavItem)}
              label="Campaigns"
              style={{
                color: compaignSubMenu.includes(selectedNavItem)
                  ? activeNavColor
                  : "black",
              }}
            >
              <MenuItem
                icon={
                  <HiTemplate
                    color={
                      selectedNavItem === "Template" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Template")}
                component={<Link to="/Template" />}
                onClick={(e: any) => setSelectedNavItem("Template")}
              >
                <b
                  hidden={selectedNavItem != "Template"}
                  style={{
                    color:
                      selectedNavItem === "Template" ? activeNavColor : "black",
                  }}
                >
                  Template
                </b>
                <p hidden={selectedNavItem == "Template"}>Template</p>
              </MenuItem>
              <MenuItem
                icon={
                  <RiContactsBookFill
                    color={
                      selectedNavItem === "Contact" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Contact")}
                component={<Link to="/Contact" />}
                onClick={(e: any) => setSelectedNavItem("Contact")}
              >
                <b
                  hidden={selectedNavItem != "Contact"}
                  style={{
                    color:
                      selectedNavItem === "Contact" ? activeNavColor : "black",
                  }}
                >
                  Contact
                </b>
                <p hidden={selectedNavItem == "Contact"}>Contact</p>
              </MenuItem>
              <MenuItem
                icon={
                  <MdEmail
                    color={
                      selectedNavItem === "Email" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Email")}
                component={<Link to="/Email" />}
                onClick={(e: any) => setSelectedNavItem("Email")}
              >
                <b
                  hidden={selectedNavItem != "Email"}
                  style={{
                    color:
                      selectedNavItem === "Email" ? activeNavColor : "black",
                  }}
                >
                  Email
                </b>
                <p hidden={selectedNavItem == "Email"}>Email</p>
              </MenuItem>
              <MenuItem
                icon={
                  <MdCampaign
                    color={
                      selectedNavItem === "Campaign" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Campaigns")}
                component={<Link to="/Campaigns" />}
                onClick={(e: any) => setSelectedNavItem("Campaign")}
              >
                <b
                  hidden={selectedNavItem != "Campaign"}
                  style={{
                    color:
                      selectedNavItem === "Campaign" ? activeNavColor : "black",
                  }}
                >
                  Campaign
                </b>
                <p hidden={selectedNavItem == "Campaign"}>Campaign</p>
              </MenuItem>
            </SubMenu>
            <MenuItem
              icon={
                <IoSettings
                  color={
                    selectedNavItem === "Settings" ? activeNavColor : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("users")}
              component={<Link to="/users" />}
              onClick={(e: any) => setSelectedNavItem("Settings")}
            >
              <b
                hidden={selectedNavItem != "Settings"}
                style={{
                  color:
                    selectedNavItem === "Settings" ? activeNavColor : "black",
                }}
              >
                Manage User
              </b>
              <p hidden={selectedNavItem == "Settings"}>Manage User</p>
            </MenuItem>
            <SubMenu
              icon={
                <RiAdminFill
                  color={
                    adminSubMenu.includes(selectedNavItem)
                      ? activeNavColor
                      : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("Admin")}
              defaultOpen={adminSubMenu.includes(selectedNavItem)}
              label="Admin"
              style={{
                color: adminSubMenu.includes(selectedNavItem)
                  ? activeNavColor
                  : "black",
              }}
            >
              <MenuItem
                icon={
                  <FaClinicMedical
                    color={
                      selectedNavItem === "Clinic" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Clinic")}
                component={<Link to="/Clinic" />}
                onClick={(e: any) => setSelectedNavItem("Clinic")}
              >
                <b
                  hidden={selectedNavItem != "Clinic"}
                  style={{
                    color:
                      selectedNavItem === "Clinic" ? activeNavColor : "black",
                  }}
                >
                  Clinic
                </b>
                <p hidden={selectedNavItem == "Clinic"}>Clinic</p>
              </MenuItem>
              <MenuItem
                icon={
                  <BiGitBranch
                    color={
                      selectedNavItem === "Source" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Source")}
                component={<Link to="/Source" />}
                onClick={(e: any) => setSelectedNavItem("Source")}
              >
                <b
                  hidden={selectedNavItem != "Source"}
                  style={{
                    color:
                      selectedNavItem === "Source" ? activeNavColor : "black",
                  }}
                >
                  Source
                </b>
                <p hidden={selectedNavItem == "Source"}>Source</p>
              </MenuItem>
              <MenuItem
                icon={
                  <FaNotesMedical
                    color={
                      selectedNavItem === "Treatment" ? activeNavColor : "black"
                    }
                  />
                }
                hidden={!Util.isAuthorized("Treatment")}
                component={<Link to="/Treatment" />}
                onClick={(e: any) => setSelectedNavItem("Treatment")}
              >
                <b
                  hidden={selectedNavItem != "Treatment"}
                  style={{
                    color:
                      selectedNavItem === "Treatment"
                        ? activeNavColor
                        : "black",
                  }}
                >
                  Treatment
                </b>
                <p hidden={selectedNavItem == "Treatment"}>Treatment</p>
              </MenuItem>
              <MenuItem
  icon={
    <FaProjectDiagram
      color={selectedNavItem === "PipeLineType" ? activeNavColor : "black"}
    />
  }
  hidden={false}
  component={<Link to="/PipeLineType" />}
  onClick={() => setSelectedNavItem("PipeLineType")}
>
  <b
    hidden={selectedNavItem !== "PipeLineType"}
    style={{
      color: selectedNavItem === "PipeLineType" ? activeNavColor : "black",
    }}
  >
    Pipeline Type
  </b>
  <p hidden={selectedNavItem === "PipeLineType"}>Pipeline Type</p>
</MenuItem>
            
            </SubMenu>
           
            <MenuItem
              icon={
                <RiDashboard2Fill
                  color={
                    selectedNavItem === "Reporting" ? activeNavColor : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("Reporting")}
              component={<Link to="/Reporting" />}
              onClick={(e: any) => setSelectedNavItem("Reporting")}
            >
              <b
                hidden={selectedNavItem != "Reporting"}
                style={{
                  color:
                    selectedNavItem === "Reporting" ? activeNavColor : "black",
                }}
              >
                Reporting
              </b>
              <p hidden={selectedNavItem == "Reporting"}>Reporting</p>
            </MenuItem>
            <MenuItem
              icon={
                <RiMenuSearchFill
                  color={
                    selectedNavItem === "Enquiries" ? activeNavColor : "black"
                  }
                />
              }
              hidden={!Util.isAuthorized("Enquiries")}
              component={<Link to="/Enquiries" />}
              onClick={(e: any) => setSelectedNavItem("Enquiries")}
            >
              <b
                hidden={selectedNavItem != "Enquiries"}
                style={{
                  color:
                    selectedNavItem === "Enquiries" ? activeNavColor : "black",
                }}
              >
                Enquiries
              </b>
              <p hidden={selectedNavItem == "Enquiries"}>Enquiries</p>
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
