import { useState } from 'react';
import { FONT_SIZE } from '../theme.js';
import { useNavigate } from 'react-router-dom';
import { getFriendRequests, loginUser } from '../api/userApi.js';
import Bunnies from '../component/Bunnies.jsx';
import BackButton from '../component/BackButton.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
import InputField from '../component/InputField.jsx';
import { addFriendRequest, initNotification } from '../utils/store.js';
import { pageCentered, authCenterBlock, authFormStyle, rowCentered } from '../sharedStyles.js';

const messageStyle = {
  fontSize: FONT_SIZE.sm,
  fontFamily: 'Pretendard',
  marginTop: '4px',
};

function Login() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState({ message: '', error: false });
  const [state, setState] = useState({ email: '', password: '' });

  const processLoginSuccess = async (data) => {
    document.cookie = `refresh=${data.refresh}; path=/;`;
    sessionStorage.setItem('access', data.access);
    sessionStorage.setItem('refresh', data.refresh);
    sessionStorage.setItem('user_id', data.id);
    sessionStorage.setItem('nickname', data.nickname);
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('avatar', data.avatar);
    initNotification();
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email: state.email, password: state.password });
      await processLoginSuccess(data);
      setLoginStatus({ message: 'Login successful. Redirecting...', error: false });

      const friendRequests = await getFriendRequests();
      if (friendRequests.message?.length > 0) {
        friendRequests.message.forEach((request) => addFriendRequest(request));
      }
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setLoginStatus({
        message: 'Invalid email or password. Please try again.',
        error: true,
      });
    }
  };

  return (
    <div style={pageCentered}>
      <div style={authCenterBlock}>
        <div style={{ ...rowCentered, alignItems: 'center' }}>
          <BackButton onClick={() => navigate('/')} />
        </div>
        <Bunnies />
        <form id="login-form" style={authFormStyle}>
          <InputField
            id="email"
            label="Email"
            type="email"
            name="email"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            placeholder="Email address"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            name="password"
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
            placeholder="Password"
          />
          <span
            className="message"
            style={
              loginStatus.error
                ? { ...messageStyle, color: 'rgba(198, 0, 3, 0.64)' }
                : { ...messageStyle, color: 'rgba(0, 102, 198, 0.32)' }
            }
          >
            {loginStatus.message}
          </span>
        </form>
        <div style={rowCentered}>
          <HomeTextButton text="LOGIN" onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
}

export default Login;
