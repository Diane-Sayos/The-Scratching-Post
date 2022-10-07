import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import FeedIcon from "@mui/icons-material/Feed";
import SettingsIcon from "@mui/icons-material/Settings";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import ExploreIcon from "@mui/icons-material/Explore";

const SideMenu = ({ setMode, mode }) => {
  return (
    <Box flex={1} p={1} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="home">
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
              <ListItemText primary="Feed"></ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="explore">
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Explore"></ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="friends">
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="People"></ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="messages">
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages"></ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ModeNightIcon />
              </ListItemIcon>
              <Switch
                onChange={(event) =>
                  setMode(mode === "light" ? "dark" : "light")
                }
              ></Switch>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default SideMenu;
