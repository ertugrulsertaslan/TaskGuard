import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./utils/authMiddleWare.js";

const PORT = 5000;
const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;
const app = express();
const prisma = new PrismaClient();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

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
    return res.status(401).send("Email or Password wrong");
  }

  const accessToken = jwt.sign(
    { userId: user.id, userRole: user.role },
    ACCESS_SECRET_TOKEN,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, userRole: user.role },
    REFRESH_SECRET_TOKEN,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 10 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    role: user.role,
    userId: user.id,
  });
});
app.post(
  "/refresh-token",
  authMiddleware(["VIEWER", "EDITOR", "ADMIN", "SUPERADMIN"]),
  (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.sendStatus(401);
    }
    try {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
        (err, payload) => {
          if (err) return res.sendStatus(403);
          const { userId, userRole } = payload;
          if (!userRole) {
            return res
              .status(400)
              .json({ error: "User role is not defined in token" });
          }
          const newAccessToken = jwt.sign(
            { userId, userRole },
            process.env.ACCESS_SECRET_TOKEN,
            { expiresIn: "10m" }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 10 * 60 * 1000,
          });
        }
      );
      return res.sendStatus(200);
    } catch (error) {
      console.error("Error fetching user from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
app.get(
  "/tasks",
  authMiddleware(["VIEWER", "EDITOR", "ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  }
);
app.get(
  "/role/:id",
  authMiddleware(["VIEWER", "EDITOR", "ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { role: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ role: user.role });
  }
);
app.get("/user", authMiddleware(["SUPERADMIN"]), async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
app.post(
  "/tasks",
  authMiddleware(["EDITOR", "ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const { title, content } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        content,
      },
    });

    res.json(task);
  }
);

app.put(
  "/tasks/:id",
  authMiddleware(["EDITOR", "ADMIN", "SUPERADMIN"]),
  async (req, res) => {
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
  }
);
app.delete(
  "/tasks/:id",
  authMiddleware(["ADMIN", "SUPERADMIN"]),
  async (req, res) => {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Task deleted" });
  }
);
app.put("/users/:id", authMiddleware(["SUPERADMIN"]), async (req, res) => {
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
