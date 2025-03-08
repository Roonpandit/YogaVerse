import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../Login/firebase/firebase-config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { IoChatbubblesOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import "./ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null); // ✅ Ref for scrolling

  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const isAdmin = user && user.email === "admin@example.com";

  useEffect(() => {
    if (!userId) return;
    const messagesRef = collection(db, "users", userId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setHasUnread(msgs.some((msg) => msg.isAdminReply && !msg.isRead));
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    // ✅ Scroll to the latest message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    await addDoc(collection(db, "users", userId, "messages"), {
      senderName: isAdmin ? "Admin" : user.displayName || "User",
      text: newMessage,
      isAdminReply: isAdmin,
      timestamp: new Date(),
      isRead: isAdmin ? false : true,
    });

    setNewMessage("");
  };

  const markMessagesAsRead = async () => {
    if (!userId) return;

    const unreadMessages = messages.filter(
      (msg) => msg.isAdminReply && !msg.isRead
    );
    if (unreadMessages.length === 0) return;

    const batchUpdates = unreadMessages.map((msg) =>
      updateDoc(doc(db, "users", userId, "messages", msg.id), { isRead: true })
    );

    await Promise.all(batchUpdates);

    setHasUnread(false);
  };

  return (
    <div className="chatty">
      <button
        className="chat-button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markMessagesAsRead();
        }}
      >
        <IoChatbubblesOutline size={24} />
        {hasUnread && <span className="green-dot"></span>}
      </button>

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Need Help?</h3>
            <AiOutlineClose
              className="close-icon"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="chat-messages" ref={messagesEndRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.isAdminReply ? "admin" : "user"}`}
              >
                <strong>{msg.isAdminReply ? "Admin" : msg.senderName}</strong>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
