import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";
import { setUsers } from "../store/user";
import {
  AppBar,
  Toolbar,
  styled,
  Avatar,
  Box,
  createTheme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageIcon from "@mui/icons-material/Message";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Search from "./Search";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = ({ handleClick, isLoggedIn, auth }) => {
  const theme = createTheme({
    palette: {
      primary: { main: "#3FA796" },
      secondary: { main: "#F5C7A9" },
    },
  });
  const [open, setOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="primary">
        {isLoggedIn ? (
          <Box>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#F5C7A9",
                }}
                to="/home"
              >
                <Typography sx={{ fontWeight: 900, marginRight: "10px" }}>
                  /ᐠ.ꞈ.ᐟ\
                </Typography>
                Scratching Post
              </Link>
              <Search />
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Link style={{ color: "#F5C7A9" }} to="/videos">
                  <VideocamIcon
                    color="secondary"
                    style={{ fontSize: "1.5rem" }}
                  />
                </Link>
                <Link style={{ color: "#F5C7A9" }} to="/messages">
                  <MessageIcon
                    color="secondary"
                    style={{ fontSize: "1.2rem" }}
                  />
                </Link>
                <Avatar
                  sx={{
                    height: "30px",
                    width: "30px",
                    border: "2px solid #f5c7a9",
                  }}
                  src={auth.avatar}
                  onClick={(event) => setOpen(true)}
                />
              </Box>
            </Toolbar>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              open={open}
              onClose={(event) => setOpen(false)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Link to={`/profile/${auth.id}`}>
                <MenuItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#3FA796",
                  }}
                >
                  <AccountCircleIcon color="secondary" />
                  <Typography color="secondary">My Profile</Typography>
                </MenuItem>
              </Link>
              <Link to="#" onClick={handleClick}>
                <MenuItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#3FA796",
                  }}
                >
                  <LogoutIcon color="secondary" />
                  <Typography color="secondary">Logout</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Link style={{ color: "#F5C7A9" }} to="/home">
                The Scratching Post /ᐠ.ꞈ.ᐟ\
              </Link>
              <Box sx={{ display: "flex", gap: 5 }}>
                <LoginModal />
                <RegisterModal />
              </Box>
            </Toolbar>
          </Box>
        )}
      </AppBar>
    </ThemeProvider>
  );
};

const mapState = (state) => {
  return {
    auth: state.auth,
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
