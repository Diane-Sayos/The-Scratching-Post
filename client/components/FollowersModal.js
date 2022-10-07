import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";

export const FollowersDiv = styled.div``;

export const FollowersList = styled.ul`
  display: flex;
  list-style-type: none;
  flex-direction: column;
`;

export const Followers = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const Unfollow = styled.button`
  padding: 5px;
  border-radius: 12px;
  border: 1px solid #f5c7a9;
  cursor: pointer;
  background-color: #3fa796;
  color: #f5c7a9;
  font-weight: 900;

  &: hover {
    background-color: #f5c7a9;
    color: #3fa796;
  }
`;

export const Length = styled.span`
  font-weight: 900;
  font-size: 18px;
`;

export const Image = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 20px;
`;

const FollowersModal = ({ listOfFollowers, auth, user, unfollow }) => {
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
        <Typography>
          Followers <Length>({listOfFollowers.length})</Length>
        </Typography>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          width={400}
          height={500}
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
            sx={{ borderBottom: "2px solid #f5c7a9" }}
            marginTop={2}
            color={"#F5C7A9"}
            variant="h4"
          >
            Followers
          </Typography>
          <Box sx={{ marginTop: 5, display: "flex" }}>
            <FollowersDiv>
              <FollowersList>
                {listOfFollowers.map((connection) => {
                  return (
                    <Followers key={connection.id}>
                      <Link to={`/profile/${connection.following.id}`}>
                        <Image src={connection.following.avatar} />
                      </Link>
                      <Typography
                        sx={{ marginRight: "100px", color: "#f5c7a9" }}
                      >
                        {connection.following.username}
                      </Typography>
                      {auth.id === user.id ? (
                        <Unfollow onClick={() => unfollow(connection)}>
                          <DeleteIcon style={{ height: "20px" }} />
                        </Unfollow>
                      ) : null}
                    </Followers>
                  );
                })}
              </FollowersList>
            </FollowersDiv>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FollowersModal;
