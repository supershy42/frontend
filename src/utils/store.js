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
  friendRequests: sessionStorage.getItem('friendRequests')
    ? JSON.parse(sessionStorage.getItem('friendRequests'))
    : [],
  gameInvites: sessionStorage.getItem('gameInvites')
    ? JSON.parse(sessionStorage.getItem('gameInvites'))
    : [],

  roundStartAlert: sessionStorage.getItem('roundStartAlert')
    ? JSON.parse(sessionStorage.getItem('roundStartAlert'))
    : [],

  tournamentEndAlert: sessionStorage.getItem('tournamentEndAlert')
    ? JSON.parse(sessionStorage.getItem('tournamentEndAlert'))
    : [],
});

// 상태 업데이트를 위한 액션들

// 로그인 시 친구 요청과 게임 요청을 초기화
export const initNotification = () => {
  store.setState({
    friendRequests: [],
    gameInvites: [],
    roundStartAlert: [],
    tournamentEndAlert: [],
  });
};

export const addFriendRequest = (request) => {
  const currentState = store.getState();
  const newFriendRequests = [...currentState.friendRequests, request];
  sessionStorage.setItem('friendRequests', JSON.stringify(newFriendRequests));
  store.setState({
    friendRequests: newFriendRequests,
  });
};

export const removeFriendRequest = (request) => {
  const currentState = store.getState();
  const newFriendRequests = currentState.friendRequests.filter(
    (r) => r !== request
  );
  sessionStorage.setItem('friendRequests', JSON.stringify(newFriendRequests));
  store.setState({
    friendRequests: newFriendRequests,
  });
};

export const addGameInvites = (request) => {
  // 최대 5개까지만 저장
  const currentState = store.getState();
  const newGameInvites = [...currentState.gameInvites, request].slice(-5);
  sessionStorage.setItem('gameInvites', JSON.stringify(newGameInvites));
  store.setState({
    gameInvites: newGameInvites,
  });
};

export const removeGameInvites = (request) => {
  const currentState = store.getState();
  const newGameInvites = currentState.gameInvites.filter((r) => r !== request);
  sessionStorage.setItem('gameInvites', JSON.stringify(newGameInvites));
  store.setState({
    gameInvites: newGameInvites,
  });
};

export const addRoundStartAlert = (alert) => {
  const currentState = store.getState();
  const newRoundStartAlert = [...currentState.roundStartAlert, alert];
  sessionStorage.setItem('roundStartAlert', JSON.stringify(newRoundStartAlert));
  store.setState({
    roundStartAlert: newRoundStartAlert,
  });
};

export const addTournamentEndAlert = (alert) => {
  const currentState = store.getState();
  const newTournamentEndAlert = [...currentState.tournamentEndAlert, alert];
  sessionStorage.setItem(
    'tournamentEndAlert',
    JSON.stringify(newTournamentEndAlert)
  );
  store.setState({
    tournamentEndAlert: newTournamentEndAlert,
  });
  //같은 토너먼트 아이디의 라운드 시작 알림 삭제
  const newRoundStartAlert = currentState.roundStartAlert.filter(
    (roundAlert) => roundAlert.tournament_id !== alert.tournament_id
  );
  sessionStorage.setItem('roundStartAlert', JSON.stringify(newRoundStartAlert));
  store.setState({
    roundStartAlert: newRoundStartAlert,
  });
};
