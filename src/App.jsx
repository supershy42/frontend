/** @jsx Supereact.createElement */
import Supereact from './Supereact/core/index.js';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import SupereactRouter from './Supereact/router/index.js';
import Background from './pages/Background.jsx';

const { Route, Router, Link } = SupereactRouter;

function App() {
  return (
    <Router>
      <Background />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
    </Router>
  );
}

export default App;
