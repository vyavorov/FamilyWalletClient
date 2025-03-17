import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Registerpage.css";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await register(name, email, password);
      authLogin(response.user, response.token);
      navigate("/");
    } catch (error) {
      setError("Registration failed.");
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p>Join Family Wallet today!</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>
        <p className="login-link">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
