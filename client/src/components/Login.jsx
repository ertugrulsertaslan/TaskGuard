import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await api.post("/login", data);
      localStorage.setItem("role", response.data.role);

      navigate("/");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
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
        Login Page
      </Typography>
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 2,
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, py: 1 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </>
  );
}

export default Login;
