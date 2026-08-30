import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IntakePortal from './pages/IntakePortal';
import AdminDashboard from './pages/AdminDashboard';
import { Coins, LayoutDashboard } from 'lucide-react';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar fade-in">
          <Link to="/" className="navbar-brand">
            <Coins size={32} />
            <span>Aurum Finance</span>
          </Link>
          <div className="navbar-links">
            <Link to="/" className="btn">Apply Now</Link>
            <Link to="/admin" className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
              <LayoutDashboard size={18} />
              Admin
            </Link>
          </div>
        </nav>
        
        <main>
          <Routes>
            <Route path="/" element={<IntakePortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
