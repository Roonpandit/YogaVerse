import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../Login/firebase/firebase-config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { FaPencilAlt } from "react-icons/fa";
import "./AdminChat.css";
import NavAdmin from "./Nav-Admin";

const AdminChat = () => {
  const [userChats, setUserChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [unreadUsers, setUnreadUsers] = useState(new Set());

  useEffect(() => {
    setLoading(true); // Start loading state
  
    const usersRef = collection(db, "users");
  
    // Listen for changes in users collection
    const unsubscribeUsers = onSnapshot(usersRef, (usersSnapshot) => {
      const usersList = [];
      const unreadSet = new Set();
      const userMessageListeners = [];
      const userLastMessageMap = new Map();
  
      usersSnapshot.forEach((userDoc) => {
        const user = { id: userDoc.id, ...userDoc.data() };
  
        if (user.role === "user") {
          usersList.push(user);
  
          const messagesRef = collection(db, "users", user.id, "messages");
          const q = query(messagesRef, orderBy("timestamp", "desc")); // Fetch latest messages
  
          // Listen for messages of each user
          const unsubscribeMessages = onSnapshot(q, (messagesSnapshot) => {
            let latestTimestamp = null;
            let hasUnread = false;
  
            messagesSnapshot.forEach((msgDoc) => {
              const msgData = msgDoc.data();
              if (!msgData.isAdminReply && !msgData.seenByAdmin) {
                hasUnread = true;
              }
              if (!latestTimestamp) {
                latestTimestamp = msgData.timestamp?.toDate() || new Date(0);
              }
            });
  
            if (hasUnread) {
              unreadSet.add(user.id);
            } else {
              unreadSet.delete(user.id);
            }
  
            userLastMessageMap.set(user.id, latestTimestamp);
            setUnreadUsers(new Set(unreadSet)); // Update unread state dynamically
  
            // Sorting Logic
            const sortedUsers = [...usersList].sort((a, b) => {
              const aHasUnread = unreadSet.has(a.id);
              const bHasUnread = unreadSet.has(b.id);
  
              if (aHasUnread && !bHasUnread) return -1;
              if (!aHasUnread && bHasUnread) return 1;
  
              if (aHasUnread && bHasUnread) {
                return userLastMessageMap.get(b.id) - userLastMessageMap.get(a.id);
              }
  
              return a.name.localeCompare(b.name);
            });
  
            setUserChats(sortedUsers);
            setLoading(false);
          });
  
          userMessageListeners.push(unsubscribeMessages);
        }
      });
  
      return () => {
        userMessageListeners.forEach((unsubscribe) => unsubscribe());
      };
    });
  
    return () => unsubscribeUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const messagesRef = collection(db, "users", selectedUser.id, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);

      // Mark messages as read in a batch
      const batch = writeBatch(db);
      msgs.forEach((msg) => {
        if (!msg.isAdminReply && !msg.seenByAdmin) {
          batch.update(doc(db, "users", selectedUser.id, "messages", msg.id), {
            seenByAdmin: true,
          });
        }
      });
      await batch.commit();

      // Remove red dot for this user
      setUnreadUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(selectedUser.id);
        return updated;
      });
    });

    return () => unsubscribe();
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendReply = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await addDoc(collection(db, "users", selectedUser.id, "messages"), {
        senderName: "Admin",
        adminId: auth.currentUser.uid,
        text: newMessage,
        isAdminReply: true,
        edited: false,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const editMessage = (message) => {
    setEditingMessage(message);
    setEditedText(message.text);
  };

  const saveEditedMessage = async (messageId) => {
    if (!editedText.trim()) return;

    try {
      await updateDoc(
        doc(db, "users", selectedUser.id, "messages", messageId),
        {
          text: editedText,
          edited: true,
        }
      );

      setEditingMessage(null);
      setEditedText("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteAllMessages = async () => {
    if (!selectedUser) return;
    try {
      const messagesRef = collection(db, "users", selectedUser.id, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      const batch = writeBatch(db);
      messagesSnapshot.forEach((messageDoc) => {
        batch.delete(
          doc(db, "users", selectedUser.id, "messages", messageDoc.id)
        );
      });
      await batch.commit();

      setMessages([]);
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  const closeChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  return (
    <>
      <NavAdmin />
      <div className="admin-chat">
        <h2>Admin Chat Panel</h2>
        <div className="chat-container">
          <div className="user-list">
            <h3>Users</h3>
            {loading ? (
              <p>Loading users...</p>
            ) : userChats.length === 0 ? (
              <p>No users with messages</p>
            ) : (
              userChats.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`user-btn ${
                    selectedUser?.id === user.id ? "selected" : ""
                  }`}
                >
                  {user.name || `User-${user.id}`}{" "}
                  {unreadUsers.has(user.id) && <div className="red-dot"></div>}
                </button>
              ))
            )}
          </div>

          <div className="chat-box">
            <h3>
              {selectedUser
                ? `Chat with ${selectedUser.name || "User"}`
                : "Select a user"}
            </h3>
            {selectedUser ? (
              <>
                <div className="messages">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${
                        msg.isAdminReply ? "admin" : "user"
                      }`}
                    >
                      {editingMessage?.id === msg.id ? (
                        <div>
                          <input
                            type="text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                          />
                          <button onClick={() => saveEditedMessage(msg.id)}>
                            Save
                          </button>
                          <button onClick={() => setEditingMessage(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span>
                          {msg.text}{" "}
                          {msg.edited && (
                            <span className="edited-msg">(Edited)</span>
                          )}
                        </span>
                      )}

                      {!msg.deleted && msg.isAdminReply && (
                        <div className="admin-actions">
                          <FaPencilAlt
                            className="edit-icon"
                            onClick={() => editMessage(msg)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onFocus={() => setTyping(true)}
                    onBlur={() => setTyping(false)}
                  />
                  <button className="send-btn" onClick={sendReply}>
                    Send
                  </button>
                </div>

                {typing && <p className="typing-indicator">Typing...</p>}

                <div className="chat-controls">
                  <button
                    className="delete-all-chat"
                    onClick={deleteAllMessages}
                  >
                    Delete All Chat
                  </button>
                  <button className="close-btn" onClick={closeChat}>
                    Close Chat
                  </button>
                </div>
              </>
            ) : (
              <p>Select a user to view messages</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChat;
