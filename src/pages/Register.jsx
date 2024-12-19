import Supereact from '../Supereact/core/index.js';
import SupereactRouter from '../Supereact/router/index.js';
import { checkNickname, registerUser, verifyEmail } from '../api/userApi.js';
import Tempcomp from './Tempcomp.jsx';

const { navigate } = SupereactRouter;

function Register() {
  const [state, setState] = Supereact.useState({
    nicknameMessage: '',
    emailMessage: '',
    verificationMessage: '',
    showVerificationSection: false,
    lastCheckedNickname: '',
    lastCheckedEmail: '',
  });

  const checkNicknameHandler = async (e) => {
    const nickname = e.target.value;
    if (state.lastCheckedNickname === nickname) return;

    try {
      await checkNickname(nickname);
      setState({
        ...state,
        nicknameMessage: 'Nickname is available',
        lastCheckedNickname: nickname,
      });
    } catch (error) {
      setState({ ...state, nicknameMessage: error.message });
    }
  };

  const sendVerificationCode = async () => {
    const email = document.getElementById('email').value;
    if (state.lastCheckedEmail === email) return;

    try {
      await verifyEmail({ email });
      setState({
        ...state,
        emailMessage: 'Verification code sent',
        showVerificationSection: true,
        lastCheckedEmail: email,
      });
    } catch (error) {
      setState({ ...state, emailMessage: error.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data['confirm-password']) {
      setState({ ...state, verificationMessage: 'Passwords do not match' });
      return;
    }

    try {
      await registerUser(data);
      setState({
        ...state,
        verificationMessage:
          'Registration successful. Redirecting to login page...',
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setState({ ...state, verificationMessage: error.message });
    }
  };

  return (
    <div className="register_page">
      <h1>Register</h1>
      <form id="register-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            onBlur={checkNicknameHandler}
            required
          />
          <span className="message">{state.nicknameMessage}</span>
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <span className="message">{state.emailMessage}</span>
          <button type="button" onClick={sendVerificationCode}>
            Send Verification Code
          </button>
        </div>

        {state.showVerificationSection && (
          <div>
            <label htmlFor="verification-code">Verification Code:</label>
            <input
              type="text"
              id="verification-code"
              name="verification-code"
              required
            />
            <span className="message">{state.verificationMessage}</span>
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
