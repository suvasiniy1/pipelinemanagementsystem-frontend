import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Profile } from "./other/Profile";
import { SearchBar } from "./header/searchBar";
import jpg from "../../src/resources/images/logo.jpg";

const menuItems = [
  { name: "Stages", path: "/stages" },
  { name: "Deals", path: "/pipeline" },
  { name: "Activities", path: "/activities" },
  { name: "Persons", path: "/persons" },
  {
    name: "Campaigns",
    submenu: [
      { name: "Template", path: "/template" },
      { name: "Contact", path: "/contact" },
      { name: "Email", path: "/email" },
      { name: "Campaign", path: "/campaigns" },
    ],
  },
  { name: "Settings", path: "/settings" },
  {
    name: "Admin",
    submenu: [
      { name: "Clinic", path: "/clinic" },
      { name: "Source", path: "/source" },
      { name: "Treatment", path: "/treatment" },
    ],
  },
  { name: "Reporting", path: "/reporting" },
  { name: "Enquiries", path: "/enquiries" },
];

function TopNav() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, menuName: string) => {
    setAnchorEl((prev) => ({
      ...prev,
      [menuName]: prev[menuName] ? null : event.currentTarget,
    }));
  };

  const handleMenuClose = (menuName: string) => {
    setAnchorEl((prev) => ({ ...prev, [menuName]: null }));
  };

  const handleNavigate = (path: string, menuName: string) => {
    handleMenuClose(menuName);
    navigate(path);
  };

  return (
    <>
      {/* Top Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#F8F8F8", boxShadow: "none", color: "#000" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img className="sideopenlogo" src={jpg} alt="Logo" style={{ height: 40 }} />
            </Box>

            <Box sx={{ flexGrow: 1, mx: 4, maxWidth: 500 }}>
              <SearchBar />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Profile />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Bottom Menu Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#1E1E1E", boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "center" }}>
            {menuItems.map((item) => (
              <Box key={item.name} sx={{ position: "relative" }}>
                {item.submenu ? (
                  <>
                    <Button
                      sx={{
                        color: "white",
                        textTransform: "none",
                        mx: 1.5,
                        "&:hover": { color: "#fbc02d" },
                      }}
                      onClick={(event) => handleMenuClick(event, item.name)}
                      endIcon={<ArrowDropDownIcon />}
                    >
                      {item.name}
                    </Button>
                    <Menu
                      anchorEl={anchorEl[item.name] || null}
                      open={Boolean(anchorEl[item.name])}
                      onClose={() => handleMenuClose(item.name)}
                      sx={{
                        "& .MuiPaper-root": {
                          backgroundColor: "#2E2E2E",
                          color: "white",
                          width: "200px",
                          padding: "5px",
                        },
                        "& .MuiMenuItem-root": {
                          "&:hover": { backgroundColor: "#444" },
                          fontSize: "14px",
                          padding: "8px 16px",
                        },
                      }}
                    >
                      {item.submenu.map((sub) => (
                        <MenuItem key={sub.name} onClick={() => handleNavigate(sub.path, item.name)}>
                          {sub.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Button
                    sx={{
                      color: "white",
                      textTransform: "none",
                      mx: 1.5,
                      "&:hover": { color: "#fbc02d" },
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.name}
                  </Button>
                )}
              </Box>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default TopNav;
