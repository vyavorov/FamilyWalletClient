import { Link } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/transactions">Transactions</Link>
        </nav>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        © 2024 Family Wallet
      </footer>
    </>
  );
}
