import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; 
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await login(email, password);
      authLogin(response.user, response.token);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Log in to your account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-link">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}
