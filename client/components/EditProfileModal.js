import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import styled from "styled-components";
import UserUpdateForm from "./UserUpdateForm";

export const Avatar = styled.img`
  border-radius: 50%;
  margin-bottom: 20px;
  border: 2px solid #f5c7a9;
  cursor: pointer;
  height: 80px;
  width: 80px;
  transition: all 1s ease;
  &:hover {
    transform: scale(1.5);
  }
`;

const EditProfileModal = ({ user }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Avatar src={user.avatar} onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          width={800}
          height={700}
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
            Update Profile
          </Typography>
          <Box sx={{ marginTop: 5 }}>
            <UserUpdateForm />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EditProfileModal;
