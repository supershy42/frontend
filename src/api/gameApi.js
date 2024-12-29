import autoFetch from './autoFetch.js';

const GAME_API_URL = process.env.GAME_API_URL;

export const createReception = async (gameData) => {
  try {
    const data = await autoFetch(`${GAME_API_URL}/reception/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    console.log('data', data);
    return data;
  } catch (error) {
    console.error('Create reception error:', error);
    throw error;
  }
};

export const joinReception = async (joinData) => {
  try {
    const data = await autoFetch(
      `${GAME_API_URL}/reception/${joinData.receptionId}/join/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          joinData.password ? { password: joinData.password } : {}
        ),
      }
    );

    return data;
  } catch (error) {
    console.error('Join reception error:', error);
    throw error;
  }
};

export const getReceptionList = async (page) => {
  try {
    const data = await autoFetch(
      `${GAME_API_URL}/reception/list?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  } catch (error) {
    console.error('Get reception list error:', error);
    throw error;
  }
};

export const inviteFriend = async (friend_id) => {
  try {
    const data = await autoFetch(`${GAME_API_URL}/reception/invite/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to_user_id: friend_id }),
    });

    return data;
  } catch (error) {
    console.error('Invite friend error:', error);
    throw error;
  }
};

export const createTournament = async (tournamentData) => {
  try {
    const data = await autoFetch(`${GAME_API_URL}/tournament/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournamentData),
    });

    return data;
  } catch (error) {
    console.error('Create tournament error:', error);
    throw error;
  }
};

export const getTournamentList = async (page) => {
  try {
    const data = await autoFetch(
      `${GAME_API_URL}/tournament/list/?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  } catch (error) {
    console.error('Get tournament list error:', error);
    throw error;
  }
};

export const getTournamentInfo = async (tournamentId) => {};

export const joinTournament = async (joinData) => {};
