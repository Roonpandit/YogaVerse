import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "./firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name) {
      alert("Please enter your name!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role, // Store role in Firestore
        dob: "",
        gender: "",
        height: "",
        weight: "",
        isProfileComplete: false,
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      await sendEmailVerification(user);
      alert(
        `Signup successful! A verification email has been sent to ${email}.`
      );

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h3>Create New Account</h3>

      <input
        type="text"
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        {/* <option value="admin">Admin</option> */}
      </select>

      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="show-password-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span
          className="show-password-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      </div>

      <button onClick={handleSignup}>Create Account</button>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
