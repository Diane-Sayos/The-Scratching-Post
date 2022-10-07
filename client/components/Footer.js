import { Box } from "@mui/material";
import React from "react";
import { connect } from "react-redux";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        padding: "2px",
        textAlign: "center",
        backgroundColor: "#3FA796",
        color: "#F5C7A9",
        fontSize: "10px",
      }}
    >
      ©BCDE Team6
    </Box>
  );
};
const mapState = (state) => {
  return state;
};
export default connect(mapState)(Footer);