import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import styled from "styled-components";

export const FollowingsDiv = styled.div``;

export const FollowingsList = styled.ul`
  display: flex;
  list-style-type: none;
  flex-direction: column;
`;
export const Following = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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

const FollowingModal = ({ unfollow, auth, user, listOfFollowings }) => {
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
          Following <Length>({listOfFollowings.length})</Length>
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
            Following
          </Typography>
          <Box sx={{ marginTop: 5, display: "flex" }}>
            <FollowingsDiv>
              <FollowingsList>
                {listOfFollowings.map((connection) => {
                  return (
                    <Following key={connection.id}>
                      <Link to={`/profile/${connection.follower.id}`}>
                        <Image src={connection.follower.avatar} />
                      </Link>
                      <Typography
                        sx={{ marginRight: "100px", color: "#f5c7a9" }}
                      >
                        {connection.follower.username}
                      </Typography>
                      {auth.id === user.id ? (
                        <Unfollow onClick={() => unfollow(connection)}>
                          <RemoveIcon />
                        </Unfollow>
                      ) : null}
                    </Following>
                  );
                })}
              </FollowingsList>
            </FollowingsDiv>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default FollowingModal;
