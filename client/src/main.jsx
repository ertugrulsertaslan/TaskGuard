import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Tasks from "./components/Tasks.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<Tasks />} />
    </Routes>
  </BrowserRouter>
);
