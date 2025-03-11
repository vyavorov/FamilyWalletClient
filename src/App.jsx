import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import Layout from './components/Layout';
import AccountsPage from './pages/AccountsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
