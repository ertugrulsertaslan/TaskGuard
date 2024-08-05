import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import User from "./User";
import "../App.css";

function Tasks() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchToken = () => {
      try {
        axios.post("http://localhost:5000/refresh-token", null, {
          withCredentials: true,
        });
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
        await axios.put(`http://localhost:5000/tasks/${selectedTask.id}`, data);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id ? { ...task, ...data } : task
          )
        );
      } else {
        const response = await axios.post("http://localhost:5000/tasks", data);
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
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
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
  const canViewTasks =
    role === "VIEWER" ||
    role === "ADMIN" ||
    role === "EDITOR" ||
    role === "SUPERADMIN";
  const canEditTasks =
    role === "ADMIN" || role === "EDITOR" || role === "SUPERADMIN";
  const canDeleteTasks = role === "ADMIN" || role === "SUPERADMIN";
  return (
    <>
      {role === "SUPERADMIN" && <User />}

      {canViewTasks && (
        <div>
          {canEditTasks && (
            <form onSubmit={handleTasks}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label>Content:</label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button type="submit">
                {selectedTask ? "Update Task" : "Create Task"}
              </button>
            </form>
          )}

          <div>
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id}>
                  <p>{task.title}</p>
                  <p>{task.content}</p>
                  {canEditTasks && (
                    <button onClick={() => handleSelectTask(task)}>
                      UPDATE
                    </button>
                  )}
                  {canDeleteTasks && (
                    <button onClick={() => handleDelete(task.id)}>
                      DELETE
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Tasks;
