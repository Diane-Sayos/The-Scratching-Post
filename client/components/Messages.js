import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getMessages } from "../store";
import ReplyIcon from "@mui/icons-material/Reply";
import { io } from "socket.io-client";

let socket;

const Messages = ({ user, messages, getMessages }) => {
  const history = useHistory();

  useEffect(() => {
    getMessages();

    socket = io();

    socket.on("messages", (message) => {
      if (user.id === message.receiverId) {
        getMessages();
      }
    });

    return () => socket.emit("forceDisconnect");
  }, []);

  const sendMessage = (friendId) => {
    history.push("/conversation/" + friendId);
  };

  const receivedSenders = [];

  return (
    <Box>
      <List>
        {messages.messages
          .filter((message) => {
            if (receivedSenders.includes(message.sender.id)) {
              return false;
            } else {
              receivedSenders.push(message.sender.id);
              return true;
            }
          })
          .map((message) => (
            <ListItem
              disablePadding
              key={message.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => sendMessage(message.sender.id)}
                >
                  <ReplyIcon />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemIcon>
                  <Avatar
                    alt="avatar"
                    src={message.sender.avatar}
                    sx={{ width: 56, height: 56 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box ml={2}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: 18, fontWeight: 600 }}
                      >
                        {message.sender.username}
                      </Typography>
                      <Typography variant="body2">{message.text}</Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: "#a1a1a1" }}
                      >
                        {message.date}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

const mapState = (state) => {
  return {
    user: state.auth,
    messages: state.messages,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMessages: () => dispatch(getMessages()),
  };
};

export default connect(mapState, mapDispatch)(Messages);