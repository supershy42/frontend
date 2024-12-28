/** @jsx Supereact.createElement */
import Supereact from './Supereact/index.js';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Background from './pages/Background.jsx';
import Router, { Route, useRouter, setRouterInstance } from './router.jsx';
import CreateGame from './pages/games/CreateGame.jsx';
import Reception from './pages/games/Reception.jsx';
import SearchGame from './pages/games/SearchGame.jsx';

function App() {
  const [route] = useRouter();

  Supereact.useEffect(() => {
    setRouterInstance(route);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Background />
      <Router>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/reception/{id}" element={<Reception />} />
        <Route path="/search-game" element={<SearchGame />} />
      </Router>
    </div>
  );
}

export default App;
