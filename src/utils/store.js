// store.js
const createStore = (initialState = {}) => {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = { ...state, ...newState };
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const store = createStore({
  friendRequests: localStorage.getItem('friendRequests')
    ? JSON.parse(localStorage.getItem('friendRequests'))
    : [],
  gameInvites: localStorage.getItem('gameInvites')
    ? JSON.parse(localStorage.getItem('gameInvites'))
    : [],

  roundStartAlert: localStorage.getItem('roundStartAlert')
    ? JSON.parse(localStorage.getItem('roundStartAlert'))
    : [],

  tournamentEndAlert: localStorage.getItem('tournamentEndAlert')
    ? JSON.parse(localStorage.getItem('tournamentEndAlert'))
    : [],
});

// 상태 업데이트를 위한 액션들

// 로그인 시 친구 요청과 게임 요청을 초기화
export const initNotification = () => {
  store.setState({
    friendRequests: [],
    gameInvites: [],
    roundStartAlert: [],
    tournamentAlert: [],
  });
};

export const addFriendRequest = (request) => {
  const currentState = store.getState();
  const newFriendRequests = [...currentState.friendRequests, request];
  localStorage.setItem('friendRequests', JSON.stringify(newFriendRequests));
  store.setState({
    friendRequests: newFriendRequests,
  });
};

export const removeFriendRequest = (request) => {
  const currentState = store.getState();
  const newFriendRequests = currentState.friendRequests.filter(
    (r) => r !== request
  );
  localStorage.setItem('friendRequests', JSON.stringify(newFriendRequests));
  store.setState({
    friendRequests: newFriendRequests,
  });
};

export const addGameInvites = (request) => {
  // 최대 5개까지만 저장
  const currentState = store.getState();
  const newGameInvites = [...currentState.gameInvites, request].slice(-5);
  localStorage.setItem('gameInvites', JSON.stringify(newGameInvites));
  store.setState({
    gameInvites: newGameInvites,
  });
};

export const removeGameInvites = (request) => {
  const currentState = store.getState();
  const newGameInvites = currentState.gameInvites.filter((r) => r !== request);
  localStorage.setItem('gameInvites', JSON.stringify(newGameInvites));
  store.setState({
    gameInvites: newGameInvites,
  });
};

export const addRoundStartAlert = (alert) => {
  const currentState = store.getState();
  const newRoundStartAlert = [...currentState.roundStartAlert, alert];
  localStorage.setItem('roundStartAlert', JSON.stringify(newRoundStartAlert));
  store.setState({
    roundStartAlert: newRoundStartAlert,
  });
};

export const addTournamentEndAlert = (alert) => {
  const currentState = store.getState();
  const newTournamentEndAlert = [...currentState.tournamentEndAlert, alert];
  localStorage.setItem(
    'tournamentEndAlert',
    JSON.stringify(newTournamentEndAlert)
  );
  store.setState({
    tournamentEndAlert: newTournamentEndAlert,
  });
  //같은 토너먼트 아이디의 라운드 시작 알림 삭제
  const newRoundStartAlert = currentState.roundStartAlert.filter(
    (alert) => alert.tournament_id !== alert.tournament_id
  );
  localStorage.setItem('roundStartAlert', JSON.stringify(newRoundStartAlert));
  store.setState({
    roundStartAlert: newRoundStartAlert,
  });
};
