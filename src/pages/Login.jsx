import Supereact from '../Supereact/core/index.js';
import SupereactRouter from '../Supereact/router/index.js';
import { loginUser } from '../api/userApi.js';

const { navigate } = SupereactRouter;

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
  padding: '80px 130px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '3px solid #004FC6',
  background: 'rgba(255, 255, 255, 0.80)',
  gap: '45px',
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

const inputStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const labelStyle = {
  fontFamily: 'Jersey 10',
  color: '#004FC6',
  fontSize: '32px',
  fontWeight: '400',
  lineHeight: 'normal',
};

const textFieldsStyle = {
  height: '58px',
  width: '318px',
  borderRadius: '18px',
  background: '#F8F8F8',
  boxShadow: '0px 4px 10px 3px rgba(0, 79, 198, 0.32) inset',
};

function Login() {
  const [loginMessage, setLoginMessage] = Supereact.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const data = await loginUser({ email, password });
      document.cookie = `refresh=${data.refresh}; path=/; secure: HttpOnly`;
      localStorage.setItem('access', data.access);
      setLoginMessage('Login successful. Redirecting to home page...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setLoginMessage('Login failed. Please check your email and password.');
    }
  };

  return (
    <div style={loginPageStyle}>
      <div style={centerBlockStyle}>
        <form id="login-form" onSubmit={handleSubmit}>
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
          <div >
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <span className="message">{loginMessage}</span>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
