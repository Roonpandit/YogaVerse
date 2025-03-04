import React, { useEffect, useState } from "react";
import { db } from "../Login/firebase/firebase-config"; // Ensure Firestore is correctly configured
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, deleteUser as deleteAuthUser } from "firebase/auth"; // Import authentication functions
import NavAdmin from "./Nav-Admin";
import "./Admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList.filter((user) => user.role === "user"));
        
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setSelectedUser({ id: userId, ...userDocSnap.data() });
      } else {
        console.log("No such user found!");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef); // Delete from Firestore

      // Get authentication instance
      const auth = getAuth();

      // Find and delete the user from Firebase Authentication
      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteAuthUser(user);
      }

      // Update UI
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSelectedUser(null);

      alert("User deleted successfully from Firestore and Authentication!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Ensure you are an admin.");
    }
  };

  return (
    <div className="Admin-Dashboard">
      <NavAdmin />
      <div className="admin-container">
        <h2 className="admin-title">All Users</h2>
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-item">
              <span className="user-name">{user.name}</span>
              <div className="btn">
                <button
                  className="action-btn"
                  onClick={() => fetchUserDetails(user.id)}
                >
                  Show Details
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedUser && (
  <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3 className="details-title">User Details</h3>
      <div className="details-content">
        <p><strong>Role:</strong> {selectedUser.role}</p>
        <p><strong>Name:</strong> {selectedUser.name}</p>
        <p><strong>DOB:</strong> {selectedUser.dob}</p>
        <p><strong>Gender:</strong> {selectedUser.gender}</p>
        <p><strong>Weight:</strong> {selectedUser.weight} kg</p>
        <p><strong>Height:</strong> {selectedUser.height} cm</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>UID:</strong> {selectedUser.id}</p>

      </div>
      <button className="close-btn" onClick={() => setSelectedUser(null)}>
        Close
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Admin;
