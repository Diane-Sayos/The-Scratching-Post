import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import styled from "styled-components";
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

export const Length = styled.span`
  font-weight: 900;
  font-size: 18px;
`;

const UserPostsModal = ({ user, auth, posts, connection, photos }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box>
      <Button
        sx={{
          backgroundColor: "#3FA796",
          color: "#F5C7A9",
          border: "1px solid #F5C7A9",
        }}
        onClick={handleOpen}
      >
        Posts ({<Length>{posts.length}</Length>})
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          flexWrap="wrap"
          marginRight="auto"
          marginLeft="auto"
          borderRadius="8px"
          backgroundColor="#3FA796"
          color={"text.primary"}
          textAlign="center"
          border="1px solid #3FA796"
          sx={{ overflow: "auto" }}
        >
          <Typography
            sx={{ borderBottom: "1px solid #F5C7A9" }}
            marginTop={2}
            color={"#F5C7A9"}
            variant="h4"
          >
            Posts
          </Typography>
          <Box sx={{ marginTop: 5 }}></Box>
          <Container>
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
                      <UserPostsHelper
                        posts={posts}
                        auth={auth}
                        photos={photos}
                      />
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
        </Box>
      </Modal>
    </Box>
  );
};

export default UserPostsModal;
