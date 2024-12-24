/** @jsx Supereact.createElement */
import Supereact from './Supereact/index.js';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Background from './pages/Background.jsx';
import Router, { Route } from './router.jsx';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Background />
      <Router>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Router>
    </div>
  );
}

export default App;
