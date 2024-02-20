import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Typography } from "@material-ui/core";
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

export const LetterAvatar = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const doLogout=()=>{
        localStorage.removeItem("isUserLoggedIn");
        navigate("/login");
    }

    return (
        <div style={{ position: "absolute", right: 0 }}>
            <React.Fragment>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar id="userAvatar" sx={{ width: 32, height: 32 }}
                            style={{ backgroundColor: 'darkolivegreen', fontSize: '1.10rem' }}>D</Avatar>
                    </IconButton>
                </Box>
                <Paper>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem sx={{ "&:hover": { backgroundColor: "transparent", } }} style={{ cursor: 'default', width: '250px' }}>
                            <div>
                                <Avatar id="userAvatar" style={{ width: '50px', height: '50px', backgroundColor: 'darkolivegreen', fontSize: '2rem' }}>D</Avatar>
                            </div>
                            <div>
                                D
                            </div>
                        </MenuItem>
                        <Divider />

                        <MenuItem id="logOut" title="Logout" onClick={(e) => {doLogout() }}>
                            <ListItemIcon>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Paper>
            </React.Fragment>
        </div>

    );
}
