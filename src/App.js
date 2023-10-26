import React, { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // Track the user being edited
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Fetch user data when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/login")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Login successful!");
        } else if (response.status === 401) {
          setMessage("Login failed. Please check your credentials.");
        } else {
          setMessage("An error occurred during login.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  

  const handleSave = (e) => {
    e.preventDefault();

    if (editingUserId) {
      // If editing a user, send a PUT request
      fetch(`http://localhost:5000/users/${editingUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: editUsername, password: editPassword }),
      })
        .then((response) => {
          if (response.status === 200) {
            setMessage("User data updated successfully");
            setUsername("");
            setPassword("");
            setEditingUserId(null); // Reset editing state
            fetchUsers(); // Fetch updated user list
          } else {
            setMessage("Error updating user data");
          }
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
    } else {
      // If not editing, you can handle this as needed (e.g., create a new user).
    }
  };

  const handleEdit = (index) => {
    const userToEdit = users[index];
    setEditingUserId(userToEdit.id);
    setEditUsername(userToEdit.username);
    setEditPassword(userToEdit.password);
  };

  const handleDelete = (index) => {
    const userToDelete = users[index];

    fetch(`http://localhost:5000/users/${userToDelete.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          // User successfully deleted from the database
          // Handle any client-side updates or messages here
        } else if (response.status === 404) {
          // User not found, handle as needed
        } else {
          // Handle other errors
        }
      })
      .catch((error) => {
        console.error("Error during user deletion:", error);
      });
  };

  const fetchUsers = () => {
    // Implement this function to fetch the updated user list
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const usersList = users.map((user, index) => (
    <div key={user.id}>
      <p>
        Username: {user.id === editingUserId ? (
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
        ) : user.username}
        <br />
        Password: {user.id === editingUserId ? (
          <input
            type={showPassword ? "text" : "password"}
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
          />
        ) : (showPassword ? user.password : "********")}
        {user.id === editingUserId ? (
          <button type="button" onClick={handleSave}>Save</button>
        ) : (
          <button type="button" onClick={() => handleEdit(index)}>Edit</button>
        )}
        <button type="button" onClick={() => handleDelete(user.id)}>
          Delete
        </button>
      </p>
    </div>
  ));

  return (
    <div className="App">
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"} Password
          </button>
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>

      <h2>Users List</h2>
      {usersList}
    </div>
  );
}

export default App;
