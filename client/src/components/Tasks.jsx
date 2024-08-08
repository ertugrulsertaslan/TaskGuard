import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import User from "./User";
import "../App.css";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Snackbar,
} from "@mui/material";
function Tasks() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();
  const fetchRole = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(`http://localhost:5000/role/${userId}`, {
        withCredentials: true,
      });
      setRole(response.data.role);
    } catch (error) {
      console.error(
        "Error fetching role:",
        error.response ? error.response.data : error.message
      );
    }
  };
  useEffect(() => {
    fetchRole();

    const intervalId = setInterval(fetchRole, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchToken = () => {
      try {
        axios.post("http://localhost:5000/refresh-token", null, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("Token yenilendi");
        }
      } catch (error) {
        console.error(
          "Error fetching tasks:",
          error.response ? error.response.data : error.message
        );
      }
    };
    const intervalId = setInterval(fetchToken, 9 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks", {
          withCredentials: true,
        });
        setTasks(response.data);
      } catch (error) {
        navigate("/login");
        console.error(
          "Error fetching tasks:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchTasks();
  }, []);
  const handleTasks = async (e) => {
    e.preventDefault();

    const data = {
      title: title,
      content: content,
    };
    try {
      if (selectedTask) {
        await axios.put(
          `http://localhost:5000/tasks/${selectedTask.id}`,
          data,
          {
            withCredentials: true,
          }
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id ? { ...task, ...data } : task
          )
        );
      } else {
        const response = await axios.post("http://localhost:5000/tasks", data, {
          withCredentials: true,
        });
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }
      setTitle("");
      setContent("");
      setSelectedTask(null);
    } catch (error) {
      console.error(
        "Error handling tasks:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        withCredentials: true,
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleSelectTask = (task) => {
    setTitle(task.title);
    setContent(task.content);
    setSelectedTask(task);
  };
  const canViewTasks = ["VIEWER", "ADMIN", "EDITOR", "SUPERADMIN"].includes(
    role
  );
  const canEditTasks = ["ADMIN", "EDITOR", "SUPERADMIN"].includes(role);
  const canDeleteTasks = ["ADMIN", "SUPERADMIN"].includes(role);
  return (
    <>
      {role === "SUPERADMIN" && <User />}
      <Container>
        {canViewTasks && (
          <>
            {canEditTasks && (
              <form onSubmit={handleTasks}>
                <Typography variant="h6" gutterBottom>
                  {selectedTask ? "Update Task" : "Create Task"}
                </Typography>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  label="Content"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "16px" }}
                >
                  {selectedTask ? "Update Task" : "Create Task"}
                </Button>
              </form>
            )}

            <Grid container spacing={2} style={{ marginTop: "16px" }}>
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <Grid item xs={12} sm={6} md={6} key={task.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="body2">{task.content}</Typography>
                      </CardContent>
                      <CardActions
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        {canEditTasks && (
                          <Button
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={() => handleSelectTask(task)}
                          >
                            Update
                          </Button>
                        )}
                        {canDeleteTasks && (
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1">No tasks available</Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}

export default Tasks;
