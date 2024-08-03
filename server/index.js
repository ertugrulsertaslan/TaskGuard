import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
const PORT = 5000;
const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;
const app = express();
const prisma = new PrismaClient();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const defaultRole = "VIEWER";
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: defaultRole,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return res.status(401).send("Geçersiz kimlik bilgileri");
  }

  const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET_TOKEN, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET_TOKEN, {
    expiresIn: "7d",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({
    accessToken,
    refreshToken,
    role: user.role,
  });
});

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  const users = await prisma.user.findMany();
  res.json({ tasks, users });
});
app.post("/tasks", async (req, res) => {
  const { title, content } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      content,
    },
  });
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const task = await prisma.task.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
    },
  });
  res.json(task);
});
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: "Task deleted" });
});
app.put("/tasks/users/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      role,
    },
  });
  res.json(user);
});

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});
