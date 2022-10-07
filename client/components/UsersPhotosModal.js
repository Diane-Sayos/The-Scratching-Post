import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import styled from "styled-components";

export const Length = styled.span`
  font-weight: 900;
  font-size: 18px;
`;

export const Container = styled.div``;

export const PhotosDiv = styled.div``;

export const PhotosList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
`;

export const Photo = styled.li`
  margin-right: 5px;
  margin-bottom: 5px;
`;

export const Image = styled.img`
  height: 60px;
  width: 60px;
`;

const UsersPhotosModal = ({ user, auth, photos, connection }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log("photos", photos);
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
          Photos (<Length>{photos.length})</Length>
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
            marginTop={2}
            color={"#F5C7A9"}
            variant="h4"
            sx={{ borderBottom: "2px solid #f5c7a9" }}
          >
            Photos
          </Typography>
          <Box sx={{ marginTop: 5 }}>
            {auth.id === user.id ? (
              <PhotosDiv>
                {photos.length ? (
                  <PhotosList>
                    {photos.map((photo) => {
                      return (
                        <Photo key={photo.id}>
                          <Image src={photo.photoUrl} />
                        </Photo>
                      );
                    })}
                  </PhotosList>
                ) : (
                  <Typography sx={{ color: "#f5c7a9" }} variant="h5">
                    Take some 📸! 🤔
                  </Typography>
                )}
              </PhotosDiv>
            ) : (
              <Container>
                {connection.id ? (
                  <PhotosDiv>
                    {connection.isAccepted ? (
                      <PhotosList>
                        {photos.map((photo) => {
                          return (
                            <Photo key={photo.id}>
                              <Image src={photo.photoUrl} />
                            </Photo>
                          );
                        })}
                      </PhotosList>
                    ) : (
                      <Container>
                        <Typography sx={{ color: "#f5c7a9" }} variant="h5">
                          User must accept your request!
                        </Typography>
                      </Container>
                    )}
                  </PhotosDiv>
                ) : (
                  <Container>
                    <Typography sx={{ color: "#f5c7a9" }} variant="h5">
                      Add user to 🔐 photos!
                    </Typography>
                  </Container>
                )}
              </Container>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UsersPhotosModal;
