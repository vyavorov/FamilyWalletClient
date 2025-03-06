import { Link } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <h1 className="header-title">Family Wallet</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/accounts">Accounts</Link>
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        © 2024 Family Wallet
      </footer>
    </>
  );
}
