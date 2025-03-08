import React, { useEffect, useState } from "react";
import { db, auth } from "../Login/firebase/firebase-config"; // Ensure Firestore is correctly configured
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
        const userData = userDocSnap.data();

        // Convert Firestore timestamps to readable date strings
        const formatTimestamp = (timestamp) => {
          return timestamp?.seconds
            ? new Date(timestamp.seconds * 1000).toLocaleString()
            : "N/A";
        };

        setSelectedUser({
          id: userId,
          ...userData,
          createdAt: formatTimestamp(userData.createdAt),
          lastLogin: formatTimestamp(userData.lastLogin),
          isProfileComplete: userData.isProfileComplete ? "Yes" : "No", // Convert boolean to text
        });
      } else {
        console.log("No such user found!");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const deleteSubcollections = async (userId) => {
    try {
      const userSubcollections = ["favorites", "messages"]; // Add subcollections if needed

      for (const subcollection of userSubcollections) {
        const subcollectionRef = collection(db, "users", userId, subcollection);
        const snapshot = await getDocs(subcollectionRef);

        // Delete each document inside the subcollection
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      }
    } catch (error) {
      console.error("Error deleting subcollections:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteSubcollections(userId); // First, delete subcollections

      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef); // Then, delete user document

      // Delete the user from Firebase Authentication
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteAuthUser(user);
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSelectedUser(null);

      alert("User and subcollections deleted successfully!");
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
            <div key={user.id} className="user-card">
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-image"
              />
              <h3 className="user-name">{user.name}</h3>
              <div className="user-actions">
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
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>DOB:</strong> {selectedUser.dob}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedUser.gender}
                </p>
                <p>
                  <strong>Weight:</strong> {selectedUser.weight} kg
                </p>
                <p>
                  <strong>Height:</strong> {selectedUser.height} cm
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Created:</strong> {selectedUser.createdAt}
                </p>
                <p>
                  <strong>Completed:</strong> {selectedUser.isProfileComplete}
                </p>

                <p>
                  <strong>Last Login:</strong> {selectedUser.lastLogin}
                </p>
                <p>
                  <strong>UID:</strong> {selectedUser.id}
                </p>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
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
