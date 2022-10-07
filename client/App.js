import React from "react";

import Navbar from "./components/Navbar";
import Routes from "./Routes";

import Footer from "./components/Footer";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box sx={{ height: "100vh", position: "relative" }}>
      <Navbar />
      <Routes />
      <Footer />
    </Box>
  );
};

export default App;