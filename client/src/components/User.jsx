import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import {
  Select,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
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
      await axios.put(
        `http://localhost:5000/users/${userId}`,
        {
          id: userId,
          role: newRole,
        },
        {
          withCredentials: true,
        }
      );
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
      <Grid container spacing={3}>
        {users &&
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Email
                  <EmailIcon sx={{ marginLeft: "5px", marginRight: "5px" }} />
                  {user.email}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Role
                  <AssignmentIndIcon
                    sx={{ marginLeft: "5px", marginRight: "5px" }}
                  />
                  {user.role}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    value={selectedRoles[user.id] || user.role}
                    label="Role"
                    onChange={(e) =>
                      handleRoleSelectChange(user.id, e.target.value)
                    }
                    sx={{
                      backgroundColor: "#f0f0f0",
                      color: "black",
                      "& .MuiSelect-select": {
                        color: "black",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                      "& .MuiMenuItem-root": {
                        color: "black",
                      },
                    }}
                  >
                    <MenuItem value="VIEWER">VIEWER</MenuItem>
                    <MenuItem value="EDITOR">EDITOR</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="SUPERADMIN">SUPERADMIN</MenuItem>
                  </Select>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleRoleChange(user.id)}
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Change Rol
                  </Button>
                </FormControl>
              </Box>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default User;
