/** @jsx Supereact.createElement */
import Supereact from './Supereact/core/index.js';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import SupereactRouter from './Supereact/router/index.js';

const { Route, Router, Link } = SupereactRouter;

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
