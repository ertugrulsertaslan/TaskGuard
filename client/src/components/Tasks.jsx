import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Tasks() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks");
        const initialRoles = response.data.users.reduce((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {});
        setSelectedRoles(initialRoles);
        setTasks(response.data.tasks);
        setUsers(response.data.users);
      } catch (error) {
        console.error(
          "Error fetching tasks:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTasks();
  }, []);
  console.log(selectedRoles);
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

  const handleRoleChange = async (userId) => {
    const newRole = selectedRoles[userId];
    try {
      await axios.put(`http://localhost:5000/tasks/users/${userId}`, {
        id: userId,
        role: newRole,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error(
        "Error updating role:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleRoleSelectChange = (userId, newRole) => {
    setSelectedRoles((prevSelectedRoles) => ({
      ...prevSelectedRoles,
      [userId]: newRole,
    }));
  };
  return (
    <>
      {role === "VIEWER" && (
        <div>
          {tasks &&
            tasks.map((task) => (
              <div key={task.id}>
                <p>{task.title}</p>
                <p>{task.content}</p>
              </div>
            ))}
        </div>
      )}
      {role === "EDITOR" && (
        <div>
          <div>
            {tasks &&
              tasks.map((task) => (
                <div key={task.id}>
                  <p>{task.title}</p>
                  <p>{task.content}</p>
                  <button onClick={() => handleSelectTask(task)}>UPDATE</button>
                </div>
              ))}
          </div>
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
        </div>
      )}
      {role === "ADMIN" && (
        <div>
          <div>
            {tasks &&
              tasks.map((task) => (
                <div key={task.id}>
                  <p>{task.title}</p>
                  <p>{task.content}</p>
                  <button onClick={() => handleDelete(task.id)}>DELETE</button>
                  <button onClick={() => handleSelectTask(task)}>UPDATE</button>
                </div>
              ))}
          </div>

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
        </div>
      )}
      {role === "SUPERADMIN" && (
        <div>
          <div>
            {tasks &&
              tasks.map((task) => (
                <div key={task.id}>
                  <p>{task.title}</p>
                  <p>{task.content}</p>
                  <button onClick={() => handleDelete(task.id)}>DELETE</button>
                  <button onClick={() => handleSelectTask(task)}>UPDATE</button>
                </div>
              ))}
          </div>

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

          <div>
            {users &&
              users.map((user) => (
                <div key={user.id}>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                  <select
                    name="role"
                    value={selectedRoles[user.id] || user.role}
                    onChange={(e) =>
                      handleRoleSelectChange(user.id, e.target.value)
                    }
                  >
                    <option value="VIEWER">VIEWER</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                  <button onClick={() => handleRoleChange(user.id)}>
                    Change Role
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Tasks;
