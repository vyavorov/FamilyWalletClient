import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Layout.css";
import menuIcon from "../menu.svg";

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            Портфейл
          </Link>

          {user && (
            <>
              <div className={`nav-links ${isMobileMenuOpen ? "show" : ""}`}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Начало
                </Link>
                <Link
                  to="/transactions"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Транзакции
                </Link>
                <Link to="/accounts" onClick={() => setMobileMenuOpen(false)}>
                  Сметки
                </Link>
                <Link to="/monthly" onClick={() => setMobileMenuOpen(false)}>
                  Месечен отчет
                </Link>
              </div>

              <button
                className="menu-toggle"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                <img src={menuIcon} alt="menu" />
              </button>
            </>
          )}

          <div className="auth-buttons">
            {user ? (
              <>
                <span className="username">{user.email}</span>
                <button className="logout-btn" onClick={logout}>
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">
                  Вход
                </Link>
                <Link to="/register" className="auth-link">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
