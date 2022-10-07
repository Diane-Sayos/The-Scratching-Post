import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useHistory, Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";

export const Length = styled.span`
  font-weight: 900;
  font-size: 18px;
`;

export const RequestDiv = styled.div``;

export const RequestList = styled.ul`
  display: flex;
  list-style-type: none;
  flex-direction: column;
`;

export const Requests = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ButtonDiv = styled.div`
  margin-right: 10px;
`;

export const Accept = styled.button`
  padding: 5px;
  border-radius: 12px;
  border: 1px solid #f5c7a9;
  cursor: pointer;
  background-color: #3fa796;
  color: #f5c7a9;
  font-weight: 900;
  margin-right: 5px;

  &: hover {
    background-color: #f5c7a9;
    color: #3fa796;
  }
`;

export const Decline = styled.button`
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

export const Image = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 20px;
`;

const RequestModal = ({
  followRequests,
  connection,
  acceptRequest,
  follow,
  unfollow,
  auth,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const history = useHistory();

  const sendMessage = () => {
    history.push("/messages/" + user.id);
  };
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
          Follow Requests <Length>({followRequests.length})</Length>
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
          width={500}
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
            Follow Requests
          </Typography>
          <Box sx={{ marginTop: 5 }}>
            <RequestDiv>
              {followRequests.length !== 0 ? (
                <Box>
                  {auth.id === user.id ? (
                    <Box>
                      <RequestList>
                        {followRequests.map((request) => {
                          return (
                            <Requests key={request.id}>
                              <Link to={`/profile/${request.following.id}`}>
                                <Image src={request.following.avatar} />
                              </Link>
                              <Typography
                                sx={{ marginRight: "20px", color: "#f5c7a9" }}
                              >
                                {request.following.username}
                              </Typography>
                              <ButtonDiv>
                                <Accept
                                  onClick={() =>
                                    acceptRequest(request, request.following, auth)
                                  }
                                >
                                  <PersonAddIcon />
                                </Accept>
                                <Decline onClick={() => unfollow(request)}>
                                  <DeleteIcon />
                                </Decline>
                              </ButtonDiv>
                            </Requests>
                          );
                        })}
                      </RequestList>
                    </Box>
                  ) : null}
                </Box>
              ) : (
                <Typography marginTop={2} color={"#F5C7A9"} variant="h5">
                  No current requests! 😅
                </Typography>
              )}
            </RequestDiv>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default RequestModal;
