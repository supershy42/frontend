/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';
import { getFriendRequests, loginUser } from '../api/userApi.js';
import Bunnies from '../component/Bunnies.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
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
  width: '700px',
  padding: '80px 62.5px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '3px solid #004FC6',
  background: 'rgba(255, 255, 255, 0.80)',
  gap: '52px',
};

const formStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '40px',
  flexShrink: '0',
};

const fieldStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const inputFieldContainerStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '318px',
};

const labelStyle = {
  fontFamily: 'Jersey 10',
  color: '#004FC6',
  fontSize: '32px',
  fontWeight: '400',
  lineHeight: 'normal',
};

const textFieldsStyle = {
  position: 'relative',
  height: '58px',
  width: '100%',
  borderRadius: '18px',
  background: '#F8F8F8',
  boxShadow: '0px 4px 10px 3px rgba(0, 79, 198, 0.32) inset',
  padding: '20px 25px',
};

const inputStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  fontSize: '15px',
  fontFamily: 'Pretendard',
  fontWeight: 500,
  color: '#004FC6',
  zIndex: 2,
  background: 'transparent',
  lineHeight: 'normal',
  padding: '0',
  border: 'none',
  outline: 'none',
};

const messageStyle = {
  fontSize: '13px',
  fontFamily: 'Pretendard',
  marginTop: '4px',
};

function Login(props) {
  const [loginStatus, setLoginStatus] = Supereact.useState({
    message: '',
    error: false,
  });
  const [state, setState] = Supereact.useState({
    email: '',
    password: '',
  });

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
    const formData = {
      email: state.email,
      password: state.password,
    };

    try {
      const data = await loginUser(formData);
      await processLoginSuccess(data);
      setLoginStatus({
        message: 'Login successful. Redirecting to home page...',
        error: false,
      });

      const friendRequests = await getFriendRequests();
      if (friendRequests.message?.length > 0) {
        friendRequests.message.forEach((request) => {
          console.log('addFriendRequest', request);
          addFriendRequest(request);
        });
      }
      setTimeout(() => props.route('/'), 2000);
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
        <Bunnies />
        <form id="login-form" style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <div style={inputFieldContainerStyle}>
              <div style={textFieldsStyle}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={state.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={inputFieldContainerStyle}>
              <div style={textFieldsStyle}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={state.password}
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
          <span
            className="message"
            style={
              loginStatus.error
                ? { ...messageStyle, color: 'rgba(198, 0, 3, 0.64)' }
                : { ...loginStatus, color: 'rgba(0, 102, 198, 0.32)' }
            }
          >
            {loginStatus.message}
          </span>
          <HomeTextButton text="LOGIN" onClick={handleLogin} />
        </form>
      </div>
    </div>
  );
}

export default Login;
