import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        background: "#343a40",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <CircularProgress />
      <br />
      <div>Loading ~</div>
    </Box>
  );
};

export default Loader;
