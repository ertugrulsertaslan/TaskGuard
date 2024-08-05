import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function User() {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        const initialRoles = response.data.reduce((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {});
        setSelectedRoles(initialRoles);
        setUsers(response.data);
      } catch (error) {
        console.error(
          "Error fetching tasks:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTasks();
  }, []);
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
    </>
  );
}

export default User;
