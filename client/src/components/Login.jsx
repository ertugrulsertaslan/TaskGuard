import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

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
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
