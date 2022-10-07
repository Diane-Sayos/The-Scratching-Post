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
import DeleteIcon from "@mui/icons-material/Delete";
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

export const DeleteDiv = styled.div`
  position: absolute;
  right: 20px;
  opacity: 0;
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &: hover ${DeleteDiv} {
    opacity: 1;
  }
`;

export const Button = styled.button`
  border-radius: 12px;
  border: 2px solid #f5c7a9;
  background-color: #3fa796;
  color: #f5c7a9;
`;

let socket;

const PostHelper = ({
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
    <Box flex={5} p={1}>
      {posts.map((post) => {
        const shareOpen = Boolean(anchorEls[post.id]);
        return (
          <Card sx={{ margin: 5 }} key={post.id}>
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
              avatar={
                <Link to={`/profile/${post.user.id}`}>
                  <Avatar
                    src={post.user.avatar}
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                  ></Avatar>
                </Link>
              }
              action={
                <IconButton
                  aria-label="settings"
                  onClick={(event) => {
                    setTargetPost(post);

                    setOpen(true);
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  {auth.id === post.user.id ? <MoreVertIcon /> : null}
                </IconButton>
              }
              title={
                auth.id ? (
                  <Link style={{ color: "#3FA796" }} to={`/posts/${post.id}`}>
                    <Typography variant="h6">{post.user.username}</Typography>
                  </Link>
                ) : (
                  <Typography sx={{ color: "#3FA796" }} variant="h6">
                    {post.user.username}
                  </Typography>
                )
              }
              subheader={
                <Typography
                  sx={{ fontSize: "10px", color: "#f5c7a9", fontWeight: 900 }}
                >
                  {post.date}
                </Typography>
              }
            />
            {photos
              .filter((photo) => photo.postId === post.id)
              .map((photo) => {
                return (
                  <CardMedia
                    key={photo.id}
                    component="img"
                    sx={{
                      height: "70%",
                      width: "70%",
                      marginRight: "auto",
                      marginLeft: "auto",
                    }}
                    image={photo.photoUrl}
                  />
                );
              })}
            <CardActions disableSpacing>
              {checkLike(post, auth) ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => unLike(auth, post)}>
                    {auth.id ? (
                      <FavoriteIcon sx={{ color: pink[500] }} />
                    ) : null}
                  </IconButton>
                  <Typography> {post.likes.length} likes</Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => addLike(auth.id, post.id)}>
                    {auth.id ? (
                      <FavoriteIcon sx={{ color: grey[100] }} />
                    ) : null}
                  </IconButton>
                  <Typography> {post.likes.length} likes</Typography>
                </Box>
              )}
              <IconButton
                aria-label="share"
                onClick={(event) => {
                  anchorEls[post.id] = event.currentTarget;
                  setAnchorEls({ ...anchorEls });
                }}
              >
                <ShareIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEls[post.id]}
                open={shareOpen}
                onClose={() => {
                  anchorEls[post.id] = null;
                  setAnchorEls({ ...anchorEls });
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <FacebookShareButton
                    url={`${location.origin}/posts/${post.id}`}
                    quote={post.body}
                  >
                    <Box display="flex" alignItems="center">
                      <FacebookIcon size={32} round />
                      <Box ml={1}>Facebook</Box>
                    </Box>
                  </FacebookShareButton>
                </MenuItem>
                <MenuItem>
                  <TwitterShareButton
                    title={post.body}
                    url={`${location.origin}/posts/${post.id}`}
                  >
                    <Box display="flex" alignItems="center">
                      <TwitterIcon size={32} round />
                      <Box ml={1}>Twitter</Box>
                    </Box>
                  </TwitterShareButton>
                </MenuItem>
              </Menu>
            </CardActions>
            <Box marginLeft={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Link to={`/profile/${post.userId}`}>
                  <Avatar
                    sx={{ border: "1px solid #F5C7A9" }}
                    src={post.user.avatar}
                  />
                </Link>
                <Link to={`/profile/${post.userId}`}>
                  <Typography variant="h6" sx={{ color: "#3FA796" }}>
                    {post.user.username}
                  </Typography>
                </Link>
              </Box>
              <Typography>{post.body}</Typography>
            </Box>
            <Box marginTop={3}>
              {post.comments.map((comment) => {
                return (
                  <Container>
                    <Box
                      marginLeft={5}
                      marginTop={3}
                      marginBottom={1}
                      key={comment.id}
                    >
                      <Box display="flex" alignItems="center">
                        <Link to={`/profile/${comment.userId}`}>
                          <Avatar
                            sx={{
                              height: "30px",
                              width: "30px",
                              border: "1px solid #F5C7A9",
                            }}
                            src={comment.user.avatar}
                          />
                        </Link>
                        <Typography sx={{ fontSize: "12px", marginLeft: 1 }}>
                          <Link
                            style={{ color: "#3FA796" }}
                            to={`/profile/${comment.userId}`}
                          >
                            {comment.user.username}
                          </Link>
                        </Typography>
                        <DeleteDiv>
                          {auth.id === comment.userId ? (
                            <Button
                              onClick={() => {
                                deleteComment(comment);
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          ) : null}
                        </DeleteDiv>
                      </Box>

                      <Typography sx={{ fontSize: "10px", marginLeft: "40px" }}>
                        {comment.body}
                      </Typography>
                    </Box>
                  </Container>
                );
              })}
              <Box display="flex" alignItems="center" justifyContent="center">
                {auth.id ? (
                  <CommentsFAB
                    authId={auth.id}
                    postId={post.id}
                    socket={socket}
                  />
                ) : null}
              </Box>
            </Box>
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

export default connect(null, mapDispatch)(PostHelper);
