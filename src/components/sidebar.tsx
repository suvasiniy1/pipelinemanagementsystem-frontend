import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiTemplate } from "react-icons/hi";
import { FaClinicMedical, FaNotesMedical, FaProjectDiagram, FaBuilding } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdCampaign } from "react-icons/md";
import {
  RiAdminFill,
  RiContactsBookFill,
  RiDashboard2Fill,
} from "react-icons/ri";
import { RxActivityLog } from "react-icons/rx";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Header } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";
import logo from "../../src/resources/images/Clinic-Lead-White.png";
import logoicon from "../../src/resources/images/Clinic-Lead-White-Icon.png";
import Util from "../others/util";
import { BiGitBranch } from "react-icons/bi";
import { HiOutlineFunnel } from "react-icons/hi2";
import { GiStairsGoal } from "react-icons/gi";
import { useAuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

interface MenuItemConfig {
  key: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  permission: string;
  displayName?: string;
}

interface SubMenuConfig {
  key: string;
  title: string;
  icon: React.ReactNode;
  permission: string;
  items: MenuItemConfig[];
}

type SideBarProps = {
  collapsed: boolean;
};

export const SideBar = ({ collapsed }: SideBarProps) => {
  const { userRole } = useAuthContext();
  const { currentTheme } = useTheme();
  const location = useLocation();
  const [selectedNavItem, setSelectedNavItem] = useState("");
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null);
  const activeNavColor = currentTheme.primaryColor;

  const campaignSubMenu = ["Template"];
  const adminSubMenu = ["Clinic", "Treatment", "Source", "PipeLineType"];

  const pathToNavMap: Record<string, string> = {
    '/stages': 'Stages',
    '/pipeline': 'pipeline',
    '/activities': 'Activities',
    '/person': 'Person',
    '/template': 'Template',
    '/users': 'Settings',
    '/clinic': 'Clinic',
    '/source': 'Source',
    '/treatment': 'Treatment',
    '/pipelinetype': 'PipeLineType',
    '/tenant': 'Tenant',
    '/reporting': 'Reporting'
  };

  useEffect(() => {
    const fullPath = location.pathname.toLowerCase();
    // Remove /PLMSUI prefix if present
    const path = fullPath.replace(/^\/plmsui/, '') || '/';
    
    // Sort routes by length (longest first) to match most specific routes first
    const sortedRoutes = Object.entries(pathToNavMap).sort(([a], [b]) => b.length - a.length);
    
    const navItem = sortedRoutes.find(([route]) => {
      // Exact match
      if (path === route) return true;
      // Match with trailing slash
      if (path === route + '/') return true;
      // Match with route parameters (e.g., /source/123)
      if (path.startsWith(route + '/') && route !== '/') return true;
      return false;
    })?.[1] || '';
    
    setSelectedNavItem(navItem);
    // Reset expanded submenu when navigating to non-submenu items
    if (navItem && !adminSubMenu.includes(navItem) && !campaignSubMenu.includes(navItem)) {
      setExpandedSubMenu(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const updateSubMenuIcon = (selector: string, isActive: boolean) => {
      const icon = document.querySelector(selector) as HTMLElement;
      if (icon) {
        if (isActive) {
          icon.style.setProperty('color', activeNavColor, 'important');
          icon.style.setProperty('fill', activeNavColor, 'important');
        } else {
          icon.style.setProperty('color', 'black', 'important');
          icon.style.setProperty('fill', 'black', 'important');
        }
      }
    };

    setTimeout(() => {
      updateSubMenuIcon('.ps-submenu-root:has([title="Admin"]) .ps-menu-icon svg', adminSubMenu.includes(selectedNavItem));
      updateSubMenuIcon('.ps-submenu-root:has([title="Campaigns"]) .ps-menu-icon svg', campaignSubMenu.includes(selectedNavItem));
    }, 100);
  }, [selectedNavItem, activeNavColor]);

  const sidebarTheme = {
    backgroundColor: currentTheme.sidebarColor,
    color: currentTheme.textColor
  };

  const MenuItemComponent = ({ item, isActive }: { item: MenuItemConfig; isActive: boolean }) => (
    <MenuItem 
      hidden={!Util.isAuthorized(item.permission)} 
      icon={item.icon} 
      title={item.title} 
      component={<Link to={item.path} />}
      onClick={() => setSelectedNavItem(item.key)}
      rootStyles={{
        ['.' + 'ps-menu-button']: {
          color: 'black !important',
          backgroundColor: 'transparent !important',
          textDecoration: 'none !important'
        },
        ['.' + 'ps-menu-label']: {
          color: 'inherit !important'
        }
      }}
    >
      {isActive ? (
        <b style={{ color: activeNavColor }}>{item.displayName || item.title}</b>
      ) : (
        <span style={{ color: 'black' }}>{item.displayName || item.title}</span>
      )}
    </MenuItem>
  );

  const getMainMenuItems = (): MenuItemConfig[] => [
    {
      key: "Stages",
      title: "Add Pipeline",
      path: "/Stages",
      icon: <HiOutlineFunnel color={selectedNavItem === "Stages" ? activeNavColor : "black"} />,
      permission: "Stages"
    },
    {
      key: "pipeline",
      title: "Sales Stage",
      path: "/pipeline",
      icon: <GiStairsGoal color={selectedNavItem === "pipeline" ? activeNavColor : "black"} />,
      permission: "pipeline"
    },
    {
      key: "Activities",
      title: "Activities",
      path: "/Activities",
      icon: <RxActivityLog color={selectedNavItem === "Activities" ? activeNavColor : "black"} />,
      permission: "Activities"
    },
    {
      key: "Person",
      title: "Persons",
      path: "/Person",
      icon: <RiContactsBookFill color={selectedNavItem === "Person" ? activeNavColor : "black"} />,
      permission: "Person"
    },
    {
      key: "Settings",
      title: "Settings",
      displayName: "Manage User",
      path: "/users",
      icon: <IoSettings color={selectedNavItem === "Settings" ? activeNavColor : "black"} />,
      permission: "users"
    },
    {
      key: "Reporting",
      title: "Reporting",
      path: "/Reporting",
      icon: <RiDashboard2Fill color={selectedNavItem === "Reporting" ? activeNavColor : "black"} />,
      permission: "Reporting"
    }
  ];

  const getSubMenus = (): SubMenuConfig[] => [
    {
      key: "Campaigns",
      title: "Campaigns",
      icon: <MdCampaign color={campaignSubMenu.includes(selectedNavItem) ? activeNavColor : "black"} />,
      permission: "Template",
      items: [
        {
          key: "Template",
          title: "Template",
          path: "/Template",
          icon: <HiTemplate color={selectedNavItem === "Template" ? activeNavColor : "black"} />,
          permission: "Template"
        }
      ]
    },
    {
      key: "Admin",
      title: "Admin",
      icon: <RiAdminFill color={adminSubMenu.includes(selectedNavItem) ? activeNavColor : "black"} />,
      permission: "Admin",
      items: [
        {
          key: "Clinic",
          title: "Clinic",
          path: "/Clinic",
          icon: <FaClinicMedical color={selectedNavItem === "Clinic" ? activeNavColor : "black"} />,
          permission: "Clinic"
        },
        {
          key: "Source",
          title: "Source",
          path: "/Source",
          icon: <BiGitBranch color={selectedNavItem === "Source" ? activeNavColor : "black"} />,
          permission: "Source"
        },
        {
          key: "Treatment",
          title: "Treatment",
          path: "/Treatment",
          icon: <FaNotesMedical color={selectedNavItem === "Treatment" ? activeNavColor : "black"} />,
          permission: "Treatment"
        },
        {
          key: "PipeLineType",
          title: "Pipeline Type",
          path: "/PipeLineType",
          icon: <FaProjectDiagram color={selectedNavItem === "PipeLineType" ? activeNavColor : "black"} />,
          permission: "PipeLineType"
        }
      ]
    }
  ];

  if (userRole === null || userRole === undefined) return null;

  return (
    <Sidebar
      collapsed={collapsed}
      width="180"
      transitionDuration={500}
      backgroundColor={sidebarTheme.backgroundColor}
      rootStyles={{ color: sidebarTheme.color }}
    >
      <Header className="sidenavhead">
        <img 
          className="sideopenlogo" 
          src={logo} 
          style={{ display: !collapsed ? "block" : "none", width: "100%", height: "auto" }} 
        />
        <img 
          className="sidehidelogo" 
          src={logoicon} 
          style={{ display: collapsed ? "block" : "none", width: "28px", height: "auto", left: "10px", top: "15px" }} 
        />
      </Header>

      <Menu style={{ paddingTop: "58px" }}>
        {getMainMenuItems().map(item => (
          <MenuItemComponent key={item.key} item={item} isActive={selectedNavItem === item.key} />
        ))}

        {getSubMenus().map(subMenu => {
          const isSubMenuActive = subMenu.key === "Admin" ? adminSubMenu.includes(selectedNavItem) : campaignSubMenu.includes(selectedNavItem);
          const isHidden = subMenu.key === "Admin" ? userRole === 0 || !Util.isAuthorized(subMenu.permission) : !Util.isAuthorized(subMenu.permission);
          const shouldBeOpen = isSubMenuActive || expandedSubMenu === subMenu.key;
          
          return (
            <SubMenu
              key={`${subMenu.key}-${selectedNavItem}`}
              icon={subMenu.icon}
              hidden={isHidden}
              defaultOpen={shouldBeOpen}
              onOpenChange={(open) => {
                if (open && !isSubMenuActive) {
                  setExpandedSubMenu(subMenu.key);
                } else if (!open && !isSubMenuActive) {
                  setExpandedSubMenu(null);
                }
              }}
              title={subMenu.title}
              label={subMenu.title}
              rootStyles={{
                ['.' + 'ps-submenu-content']: {
                  color: isSubMenuActive ? activeNavColor : 'black !important'
                },
                ['.' + 'ps-menu-label']: {
                  color: isSubMenuActive ? activeNavColor : 'black !important'
                }
              }}
            >
              {subMenu.items.map(item => (
                <MenuItemComponent key={item.key} item={item} isActive={selectedNavItem === item.key} />
              ))}
            </SubMenu>
          );
        })}

        <MenuItem 
          hidden={userRole !== 0} 
          title="Tenants" 
          component={<Link to="/Tenant" />} 
          onClick={() => setSelectedNavItem("Tenant")} 
          icon={<FaBuilding color={selectedNavItem === "Tenant" ? activeNavColor : "black"} />}
          rootStyles={{
            ['.' + 'ps-menu-button']: {
              color: 'black !important',
              backgroundColor: 'transparent !important'
            }
          }}
        >
          <b hidden={selectedNavItem !== "Tenant"} style={{ color: selectedNavItem === "Tenant" ? activeNavColor : "black" }}>Tenants</b>
          <p hidden={selectedNavItem === "Tenant"}>Tenants</p>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};