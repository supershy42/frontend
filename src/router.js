import Home from '@pages/Home';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Game from '@pages/game/Game';
import CreateRoom from '@pages/game/CreateRoom';
import JoinRoom from '@pages/game/JoinRoom';
import WaitingRoom from '@pages/game/WaitingRoom';
import Friends from '@pages/Friends';
import PlayGame from '@pages/game/PlayGame';


class Router {
    static routes = {
      '/': Home,
      '/login': Login,
      '/profile': Profile,
      '/game': Game,
      '/game/create': CreateRoom,
      '/game/join': JoinRoom,
      '/game/waiting': WaitingRoom,
      '/game/play': PlayGame,
      '/friends': Friends,
    };
  }
  