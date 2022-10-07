//landing page / newsfeed

import React from "react";
import { connect } from "react-redux";
import { Box } from "@mui/material";
import PostHelper from "./PostHelper";
import { Link } from 'react-router-dom';

const Feed = ({ posts, auth, photos }) => {
  return (
    <Box flex={5} p={1}>
      {
        posts.length ? <PostHelper posts={posts} auth={auth} photos={photos} /> :
        <div>
          <p>You are not following anyone and you do not have any posts yet. Check out <Link to='/explore'>Explore</Link> for Public Content.</p>
        </div>
      }
    </Box>
  );
};

const mapState = (state) => {
  const followedList = [];
  state.connections.map((connection) => {
    if (
      connection.followingId === state.auth.id &&
      connection.isAccepted === true
    ) {
      followedList.push(connection.followerId);
    }
  });
  const posts =
    state.posts.filter(
      (post) =>
        followedList.includes(post.userId) || post.userId === state.auth.id
    ) || [];
  return {
    posts,
    auth: state.auth,
    photos: state.photos,
  };
};

export default connect(mapState)(Feed);