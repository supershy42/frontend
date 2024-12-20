const USER_API_URL = process.env.USER_API_URL;

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
