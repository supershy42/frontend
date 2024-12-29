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
import FriendChat from './pages/FriendChat.jsx';
import {
  addFriendRequest,
  addGameInvites,
  addRoundStartAlert,
  addTournamentEndAlert,
} from './utils/store.js';
import SearchTournament from './pages/games/SearchTournament.jsx';
import PlayerOption from './pages/PlayerOptions.jsx';
import CreateTournament from './pages/games/CreateTournament.jsx';
import Arena from './pages/games/Arena.jsx';

const USER_WS_URL = process.env.USER_WS_URL;

function App() {
  const [route] = useRouter();
  const [isConnected, setIsConnected] = Supereact.useState(false);

  Supereact.useEffect(() => {
    setRouterInstance(route);
    const ws = new WebSocket(
      `${USER_WS_URL}/notifications/?token=${localStorage.getItem('access')}`
    );

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'friend.request') {
        addFriendRequest(data.content);
      } else if (data.type === 'reception.invitation') {
        addGameInvites(data);
      } else if (data.type === 'tournament.round.start') {
        addRoundStartAlert(data.content);
      } else if (data.type === 'tournament.end') {
        addTournamentEndAlert(data.content);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.close();
    };
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
        <Route path="/chatting" element={<FriendChat />} />
        <Route path="/create-tournament" element={<CreateTournament />} />
        <Route path="/search-tournament" element={<SearchTournament />} />
        <Route path="/tournament/{id}" element={<SearchGame />} />
        <Route path="/player-option" element={<PlayerOption />} />
        <Route path="/arena" element={<Arena />} />
      </Router>
    </div>
  );
}

export default App;
