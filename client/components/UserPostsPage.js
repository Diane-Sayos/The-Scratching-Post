//all images uploaded by user should show up here descending order from the latest one to the lowest one?
import React from "react";
import { connect } from "react-redux";
import PostHelper from "./PostHelper";
import styled from "styled-components";
import { Box } from "@mui/material";
import UserPostsHelper from "./UserPostsHelper";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
`;

export const Title = styled.h4`
  text-align: center;
`;

const UserPostsPage = ({ user, posts, auth, photos, connection }) => {
  return (
    <Container>
      <Title>My Posts</Title>
      {auth.id === user.id ? (
        <Box sx={{ display: "flex" }}>
          {posts.length ? (
            <UserPostsHelper posts={posts} auth={auth} photos={photos} />
          ) : (
            <p>No Posts Yet.</p>
          )}
        </Box>
      ) : (
        <Box>
          {connection.id ? (
            <div>
              {connection.isAccepted ? (
                <userPostsHelper posts={posts} auth={auth} photos={photos} />
              ) : (
                <div>
                  <p>waiting on user approval</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>User is private.</p>
            </div>
          )}
        </Box>
      )}
    </Container>
  );
};
const mapState = (state, { match }) => {
  const user = state.users.find((user) => user.id === match.params.id) || {};
  const posts = state.posts.filter((post) => post.userId === user.id) || [];
  const connection =
    state.connections.find(
      (connection) =>
        connection.followerId === user.id &&
        connection.followingId === state.auth.id
    ) || {};
  return {
    user,
    posts,
    photos: state.photos,
    auth: state.auth,
    connection,
  };
};

export default connect(mapState)(UserPostsPage);
