/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';
import { loginUser } from '../api/userApi.js';
import HomeTextButton from '../component/HomeTextButton.jsx';

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

const errorMessageStyle = {
  fontSize: '13px',
  fontFamily: 'Pretendard',
  color: 'rgba(198, 0, 3, 0.64)',
  marginTop: '4px',
};

function Login(props) {
  const [loginMessage, setLoginMessage] = Supereact.useState('');
  const [state, setState] = Supereact.useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    const formData = {
      email: state.email,
      password: state.password,
    };

    try {
      const data = await loginUser(formData);
      document.cookie = `refresh=${data.refresh}; path=/; secure: HttpOnly`;
      localStorage.setItem('access', data.access);
      setLoginMessage('Login successful. Redirecting to home page...');
      setTimeout(() => props.route('/'), 2000);
    } catch (error) {
      setLoginMessage('Login failed. Please check your email and password.');
    }
  };

  return (
    <div style={loginPageStyle}>
      <div style={centerBlockStyle}>
        <div
          style={{
            display: 'flex',
            height: '46.5px',
            alignItems: 'flex-start',
            gap: '80px',
          }}
        >
          <img
            src="/public/images/bunny.png"
            alt="bunny"
            width="50"
            height="46.5"
          />
          <img
            src="/public/images/bunny.png"
            alt="bunny"
            width="50"
            height="46.5"
          />
          <img
            src="/public/images/bunny.png"
            alt="bunny"
            width="50"
            height="46.5"
          />
        </div>
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
          <span className="message" style={errorMessageStyle}>
            {loginMessage}
          </span>
          <HomeTextButton text="LOGIN" onClick={handleLogin} />
        </form>
      </div>
    </div>
  );
}

export default Login;
