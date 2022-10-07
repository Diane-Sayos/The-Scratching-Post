//landing page / newsfeed

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Box, Menu, MenuItem, Modal } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red, grey, pink } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentHelper from "./CommentHelper";
import {
  addLike,
  deleteLike,
  deletePost,
  deletePhoto,
  setPhotos,
  setPosts,
  deleteComment,
  setUsers,
} from "../store";
import Popover from "@mui/material/Popover";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import CommentsFAB from "./CommentsFAB";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import { io } from "socket.io-client";
import PostUpdateForm from "./PostUpdateForm";
import styled from "styled-components";

let socket;

/**
 * COMPONENT
 */
const userPostsHelper = ({
  posts,
  auth,
  photos,
  addLike,
  deleteLike,
  deletePost,
  getPosts,
  getPhotos,
  deleteComment,
  getUsers,
}) => {
  const [open, setOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(false);
  let [targetPost, setTargetPost] = useState({});
  const [anchorEls, setAnchorEls] = useState({});

  useEffect(() => {
    socket = io();

    socket.on("createPost", (creatorId) => {
      getPosts();
      getPhotos();
    });

    socket.on("createUser", (creatorId) => {
      getPosts();
      getPhotos();
      getUsers();
    });

    return () => socket.emit("forceDisconnect");
  }, []);

  useEffect(() => {
    const anchorEls = {};
    posts.forEach((post) => {
      anchorEls[post.id] = null;
    });
    setAnchorEls(anchorEls);
  }, [posts]);

  const checkLike = (post, auth) => {
    const like = post.likes.find((like) => like.userId === auth.id);
    return like;
  };
  const unLike = (auth, post) => {
    const like = checkLike(post, auth);
    deleteLike(like.id, post.id);
  };

  return (
    <Box display="flex" flex={5} p={1}>
      {posts.map((post) => {
        const shareOpen = Boolean(anchorEls[post.id]);
        return (
          <Card
            sx={{
              backgroundColor: "#3FA796",
              margin: 5,
              width: "20%",
              border: "1px solid #F5C7A9",
            }}
            key={post.id}
          >
            {auth.id === targetPost.userId ? (
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={(event) => setOpen(false)}
              >
                <MenuItem
                  onClick={() => {
                    setEditPost(targetPost);
                    setOpen(false);
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    console.log("here");
                    setOpen(false);
                    deletePost(targetPost, photos);
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            ) : null}
            <CardHeader
              action={
                <IconButton
                  aria-label="settings"
                  onClick={(event) => {
                    setTargetPost(post);

                    setOpen(true);
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  {auth.id === post.user.id ? (
                    <MoreVertIcon style={{ color: "#F5C7A9" }} />
                  ) : null}
                </IconButton>
              }
              subheader={
                <Typography
                  sx={{ fontSize: "10px", color: "#F5C7A9", fontWeight: 900 }}
                >
                  {post.date.slice(0, 9)}
                </Typography>
              }
            />
            {photos
              .filter((photo) => photo.postId === post.id)
              .map((photo) => {
                return (
                  <Link to={`/posts/${post.id}`}>
                    <CardMedia
                      key={photo.id}
                      component="img"
                      sx={{
                        height: "60%",
                        width: "60%",
                        marginRight: "auto",
                        marginLeft: "auto",
                        marginBottom: 10,
                      }}
                      image={photo.photoUrl}
                    />
                  </Link>
                );
              })}
          </Card>
        );
      })}
      <Modal
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        open={!!editPost}
        onClose={(event) => setEditPost(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={450}
          height={750}
          borderRadius="8px"
          backgroundColor={"#3FA796"}
          color={"text.primary"}
          textAlign="center"
        >
          <Typography
            sx={{ borderBottom: "1px solid #F5C7A9" }}
            marginTop={2}
            color={"#F5C7A9"}
            variant="h5"
          >
            Update Post
          </Typography>
          <Box sx={{ marginTop: 5 }}>
            <PostUpdateForm post={editPost} />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const mapDispatch = (dispatch) => {
  return {
    addLike: async (authId, postId) => {
      await dispatch(addLike(authId, postId));
      socket.emit("createPost");
    },
    deleteLike: async (likeId, postId) => {
      await dispatch(deleteLike(likeId, postId));
      socket.emit("createPost");
    },
    getPosts: () => dispatch(setPosts()),
    getPhotos: () => dispatch(setPhotos()),
    deletePost: async (post, photos) => {
      const photosToDelete = photos.filter((photo) => photo.postId === post.id);
      for (const photo of photosToDelete) {
        await dispatch(deletePhoto(photo));
      }
      await dispatch(deletePost(post));
      socket.emit("createPost");
    },
    deleteComment: async (comment) => {
      await dispatch(deleteComment(comment));
      socket.emit("createPost");
    },
    getUsers: () => {
      dispatch(setUsers());
    },
  };
};

export default connect(null, mapDispatch)(userPostsHelper);
