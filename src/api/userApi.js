import autoFetch from './autoFetch.js';

const USER_API_URL = process.env.USER_API_URL;
const FRIEND_API_URL = process.env.FRIEND_API_URL;
const CHAT_API_URL = process.env.CHAT_API_URL;

export const checkNickname = async (nickname) => {
  const response = await fetch(`${USER_API_URL}/register/nickname-check/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${USER_API_URL}/register/complete/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to register user');
  }

  return data;
};

export const verifyEmail = async (userData) => {
  const response = await fetch(`${USER_API_URL}/register/email-check/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to verify email');
  }

  return data;
};

export const loginUser = async (userData) => {
  const response = await fetch(`${USER_API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to login user');
  }

  return data;
};

export const getUserInfo = async (userId) => {
  try {
    const data = await autoFetch(`${USER_API_URL}/user/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};

export const getFriendList = async () => {
  try {
    const data = await autoFetch(`${FRIEND_API_URL}/list/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Get friend list error:', error);
    throw error;
  }
};

export const searchUser = async (searchQuery) => {
  try {
    const data = await autoFetch(
      `${USER_API_URL}/search/?nickname=${searchQuery}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  } catch (error) {
    console.error('Search user error:', error);
    throw error;
  }
};

export const addFriend = async (nickname) => {
  try {
    const data = await autoFetch(`${FRIEND_API_URL}/request/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    });
  } catch (error) {
    console.error('Add friend error:', error);
    throw error;
  }
};

export const acceptFriend = async (id, accept) => {
  try {
    const data = await autoFetch(`${FRIEND_API_URL}/respond/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        friend_request_id: id,
        action: accept ? 'accept' : 'reject',
      }),
    });
  } catch (error) {
    console.error('Accept friend error:', error);
    throw error;
  }
};

export const modifyProfile = async (formData) => {
  try {
    const data = await autoFetch(`${USER_API_URL}/profile/`, {
      method: 'PUT',
      body: formData,
    });

    return data;
  } catch (error) {
    console.error('Modify profile error:', error);
    throw error;
  }
};

export const getFriendRequests = async () => {
  try {
    const data = await autoFetch(`${FRIEND_API_URL}/received-requests/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Get friend requests error:', error);
    throw error;
  }
};

export const getChatList = async (chatroomId) => {
  try {
    const data = await autoFetch(`${FRIEND_API_URL}/${chatroomId}/messages/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Get chat list error:', error);
    throw error;
  }
};

export const getChattingRoom = async (chatroom_id) => {
  try {
    const data = await autoFetch(`${CHAT_API_URL}/${chatroom_id}/messages/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Get chatting room error:', error);
    throw error;
  }
};
