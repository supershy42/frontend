import Supereact from '../Supereact/core/index.js';
import SupereactRouter from '../Supereact/router/index.js';
import { loginUser } from '../api/userApi.js';

const { navigate } = SupereactRouter;

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
    <div>
      <h1>Login</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <div>
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
  );
}

export default Login;
