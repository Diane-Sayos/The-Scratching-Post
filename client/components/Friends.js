import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { addConnection, deleteConnection } from "../store";

const Friends = ({ user, connections, deleteConnection, addConnection }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    axios
      .get("/api/users", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setFriends(res.data);
      });
  }, []);

  const getFollowAction = (friend) => {
    const findConnection = connections.find(
      (connection) =>
        connection.followerId === friend.id &&
        connection.followingId === user.id
    );
    if (findConnection) {
      return (
        <Button
          variant="contained"
          onClick={() => deleteConnection(findConnection)}
        >
          Unfollow
        </Button>
      );
    }
    return (
      <Button variant="contained" onClick={() => addConnection(user, friend)}>
        Follow
      </Button>
    );
  };

  return (
    <Box>
      <List>
        {friends
          .filter((friend) => friend.id !== user.id && connections.some(
            (connection) =>
              connection.followerId === friend.id &&
              connection.followingId === user.id
          ))
          .map((friend) => (
            <ListItem
              disablePadding
              key={friend.id}
              secondaryAction={getFollowAction(friend)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <img src={friend.avatar} alt="avatar" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box ml={2}>
                      <Typography variant="h6" gutterBottom>
                        {friend.username}
                      </Typography>
                      <Box>{friend.email}</Box>
                      <Box>{friend.bio}</Box>
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
    connections: state.connections,
  };
};

const mapDispatch = (dispatch) => {
  return {
    deleteConnection: (connection) => dispatch(deleteConnection(connection)),
    addConnection: (following, follower) =>
      dispatch(addConnection(following, follower)),
  };
};

export default connect(mapState, mapDispatch)(Friends);