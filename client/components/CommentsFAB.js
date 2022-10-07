import * as React from "react";
import { Box } from "@mui/material/";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CommentHelper from "./CommentHelper";

function CommentsFAB({ authId, postId, socket }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ padding: "10px" }}>
      <Button
        sx={{
          backgroundColor: "#3FA796",
          color: "#F5C7A9",
          border: "2px solid #F5C7A9",
          fontWeight: 900,
          marginBottom: 2,
        }}
        onClick={handleOpen}
      >
        Post a Comment
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
          sx={{ overflow: "auto" }}
        >
          <Typography
            sx={{ textAlign: "center", borderBottom: "1px solid #F5C7A9" }}
            marginTop={2}
            color={"#F5C7A9"}
            variant="h5"
          >
            Post a comment
          </Typography>
          <Box sx={{ marginTop: 5 }}>
            <CommentHelper authId={authId} postId={postId} socket={socket} />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default CommentsFAB;
