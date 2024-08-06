import "./App.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import TaskIcon from "@mui/icons-material/Task";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
function App() {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontSize: "3rem",
          mb: 5,
          color: "black",
        }}
      >
        HomePage
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          component={Link}
          to="/login"
          color="primary"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              color: "inherit",
              textDecoration: "none",
            },
          }}
          startIcon={<PersonIcon />}
        >
          <Typography variant="button">Login</Typography>
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/tasks"
          color="primary"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              color: "inherit",
              textDecoration: "none",
            },
          }}
          startIcon={<TaskIcon />}
        >
          <Typography variant="button">Tasks</Typography>
        </Button>

        <Button
          variant="contained"
          component={Link}
          to="/register"
          color="primary"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              color: "inherit",
              textDecoration: "none",
            },
          }}
          startIcon={<PersonAddAltIcon />}
        >
          <Typography variant="button">Register</Typography>
        </Button>
      </Box>
    </>
  );
}

export default App;
