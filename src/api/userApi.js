import autoFetch from './autoFetch.js';

const USER_API_URL = process.env.USER_API_URL;
const FRIEND_API_URL = process.env.FRIEND_API_URL;
const CHAT_API_URL = process.env.CHAT_API_URL;

export const checkNickname = async (nickname) => {
  try {
    const response = await fetch(`${USER_API_URL}/register/nickname-check/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: window.location.origin,
      },
      credentials: 'include',
      body: JSON.stringify({ nickname }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || '닉네임 확인에 실패했습니다.',
      };
    }

    return data;
  } catch (error) {
    console.error('Check nickname error:', error);
    throw error;
  }
};

export const registerUser = async (formData) => {
  console.log('Sending registration data:', formData);
  try {
    const response = await fetch(`${USER_API_URL}/register/complete/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: window.location.origin,
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        code: formData.verificationCode,
      }),
    });

    console.log('Registration response status:', response.status);
    const data = await response.json();
    console.log('Registration response data:', data);

    if (!response.ok) {
      if (response.status === 409) {
        throw {
          status: response.status,
          message: '이미 사용 중인 닉네임이거나 이메일입니다.',
        };
      } else if (response.status === 400) {
        throw {
          status: response.status,
          message: data.message || '입력하신 정보가 올바르지 않습니다.',
        };
      } else {
        throw {
          status: response.status,
          message: data.message || '회원가입에 실패했습니다.',
        };
      }
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
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
  try {
    const response = await fetch(`${USER_API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Failed to login user',
      };
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
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
