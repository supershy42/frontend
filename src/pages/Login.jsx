import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriendRequests, loginUser } from '../api/userApi.js';
import Bunnies from '../component/Bunnies.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
import InputField from '../component/InputField.jsx';
import { addFriendRequest, initNotification } from '../utils/store.js';

const loginPageStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const centerBlockStyle = {
  display: 'flex',
  width: 'min(700px, 90vw)',
  padding: 'clamp(36px, 5vw, 60px) clamp(10px, 2vw, 28px) clamp(16px, 2.5vw, 30px)',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '4px solid #004FC6',
  background: 'rgba(235, 243, 255, 0.92)',
  boxShadow: '6px 6px 0px rgba(0, 79, 198, 0.35)',
  gap: 'clamp(20px, 3vw, 36px)',
};

const formStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'clamp(18px, 2.8vw, 36px)',
  flexShrink: '0',
};

const messageStyle = {
  fontSize: '13px',
  fontFamily: 'Pretendard',
  marginTop: '4px',
};

function Login() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState({ message: '', error: false });
  const [state, setState] = useState({ email: '', password: '' });

  const processLoginSuccess = async (data) => {
    document.cookie = `refresh=${data.refresh}; path=/; secure: HttpOnly`;
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('user_id', data.id);
    localStorage.setItem('nickname', data.nickname);
    localStorage.setItem('email', data.email);
    localStorage.setItem('avatar', data.avatar);
    initNotification();
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email: state.email, password: state.password });
      await processLoginSuccess(data);
      setLoginStatus({ message: 'Login successful. Redirecting to home page...', error: false });

      const friendRequests = await getFriendRequests();
      if (friendRequests.message?.length > 0) {
        friendRequests.message.forEach((request) => addFriendRequest(request));
      }
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setLoginStatus({
        message: 'Login failed. Please check your email and password.',
        error: true,
      });
    }
  };

  return (
    <div style={loginPageStyle}>
      <div style={centerBlockStyle}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.7,
              transition: 'opacity 0.15s',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
          >
            <img
              src="/public/images/right_arrow.png"
              alt="back"
              style={{ width: 'clamp(22px, 3vw, 45px)', height: 'clamp(24px, 3.5vw, 48px)' }}
            />
          </button>
        </div>
        <Bunnies />
        <form id="login-form" style={formStyle}>
          <InputField
            id="email"
            label="Email"
            type="email"
            name="email"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            placeholder="example@email.com"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            name="password"
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
            placeholder="8자 이상 입력"
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
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <HomeTextButton text="LOGIN" onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
}

export default Login;
