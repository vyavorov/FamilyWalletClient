import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Layout.css"; // Външен CSS файл за стилове

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="layout">
      {/* Навигация */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">FamilyWallet</Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/accounts">Accounts</Link></li>
          </ul>
          <div className="auth-buttons">
            {user ? (
              <>
                <span className="username">{user.email}</span>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">Login</Link>
                <Link to="/register" className="auth-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Основно съдържание */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
