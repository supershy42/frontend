import { useState } from 'react';
import { FONT_SIZE } from '../theme.js';
import { useNavigate } from 'react-router-dom';
import { checkNickname, registerUser, verifyEmail } from '../api/userApi.js';
import Bunnies from '../component/Bunnies.jsx';
import BackButton from '../component/BackButton.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
import InputField from '../component/InputField.jsx';
import Timer from '../component/Timer.jsx';
import { pageCentered, authCenterBlock, authFormStyle, authBackButtonRow, authButtonRow } from '../sharedStyles.js';

const registerFormStyle = {
  ...authFormStyle,
  justifyContent: 'center',
  gap: 'clamp(16px, 2.5vw, 30px)',
  minHeight: 0,
};

const verificationButtonStyle = {
  position: 'absolute',
  right: 'clamp(8px, 1.2vw, 16px)',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#004FC6',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Pretendard',
  fontSize: FONT_SIZE.sm,
  fontWeight: '700',
  zIndex: 3,
  padding: '6px 4px',
  borderRadius: '4px',
};

function Register() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
    email: '',
    verificationCode: '',
    nicknameMessage: '',
    emailMessage: '',
    passwordMessage: '',
    verificationCodeMessage: '',
  });

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Message`]: '',
    }));
  };

  const checkNicknameHandler = async (e) => {
    const nickname = e.target.value;
    if (!nickname) return;

    try {
      await checkNickname(nickname);
      setState((prev) => ({ ...prev, nicknameMessage: '' }));
    } catch (error) {
      const errmessage =
        error.status === 409
          ? 'This nickname is already in use.'
          : 'Unable to verify nickname. Please try again.';
      setState((prev) => ({ ...prev, nicknameMessage: errmessage }));
    }
  };

  const checkPasswordMatch = (e) => {
    const confirmPassword = e.target.value;
    if (!confirmPassword) return;

    setState((prev) => ({
      ...prev,
      passwordMessage:
        confirmPassword !== state.password
          ? 'Passwords do not match.'
          : '',
    }));
  };

  const sendVerificationCode = async () => {
    if (!state.email) {
      setState((prev) => ({ ...prev, emailMessage: 'Please enter your email address.' }));
      return;
    }

    try {
      await verifyEmail({ email: state.email });
      setIsTimerRunning(false);
      setTimeout(() => setIsTimerRunning(true), 0);
    } catch (error) {
      if (error.status === 409) {
        setState((prev) => ({ ...prev, emailMessage: 'This email is already registered.' }));
      } else {
        setState((prev) => ({ ...prev, emailMessage: 'Unable to send verification code. Please try again.' }));
      }
    }
  };

  const handleRegister = async () => {
    const errors = {};
    if (!state.nickname) errors.nicknameMessage = 'This field is required.';
    if (!state.password) errors.passwordMessage = 'This field is required.';
    if (!state.confirmPassword) errors.passwordMessage = 'This field is required.';
    if (!state.email) errors.emailMessage = 'This field is required.';
    if (!state.verificationCode) errors.verificationCodeMessage = 'This field is required.';

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, ...errors }));
      return;
    }

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({ ...prev, passwordMessage: 'Passwords do not match.' }));
      return;
    }

    try {
      await registerUser({
        nickname: state.nickname,
        password: state.password,
        email: state.email,
        code: state.verificationCode,
      });
      setState((prev) => ({
        ...prev,
        verificationCodeMessage: 'Registration successful. Redirecting to login...',
      }));
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMsg = error.message || '';
      const fieldErrors = {};

      if (errorMsg.toLowerCase().includes('password')) {
        fieldErrors.passwordMessage = errorMsg;
      } else if (errorMsg.toLowerCase().includes('nickname')) {
        fieldErrors.nicknameMessage = errorMsg;
      } else if (errorMsg.toLowerCase().includes('email')) {
        fieldErrors.emailMessage = errorMsg;
      } else if (errorMsg.toLowerCase().includes('code')) {
        fieldErrors.verificationCodeMessage = errorMsg;
      } else {
        fieldErrors.verificationCodeMessage = errorMsg;
      }

      setState((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  return (
    <div className="register_page" style={pageCentered}>
      <div style={authCenterBlock}>
        <div style={authBackButtonRow}>
          <BackButton onClick={() => navigate('/login')} />
        </div>
        <Bunnies />
        <form id="register-form" style={registerFormStyle}>
          <InputField
            id="nickname"
            label="nickname"
            type="text"
            name="nickname"
            value={state.nickname}
            onChange={handleInputChange}
            onBlur={checkNicknameHandler}
            placeholder="Enter nickname"
            error={state.nicknameMessage}
            maxLength={30}
          />
          <InputField
            id="password"
            label="password"
            type="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
            placeholder="Enter password"
          />
          <InputField
            id="confirm-password"
            label={<span>Confirm<br />password</span>}
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleInputChange}
            onBlur={checkPasswordMatch}
            placeholder="Confirm your password"
            error={state.passwordMessage}
          />
          <InputField
            id="email"
            label="e-mail"
            type="email"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            placeholder="Email address"
            error={state.emailMessage}
          >
            <button
              type="button"
              onClick={sendVerificationCode}
              style={verificationButtonStyle}
            >
              {isTimerRunning ? 'Resend' : 'Verify'}
            </button>
          </InputField>
          <InputField
            id="verification-code"
            label={<span>Verification<br />Code</span>}
            type="text"
            name="verificationCode"
            value={state.verificationCode}
            onChange={handleInputChange}
            placeholder="Enter verification code"
            error={state.verificationCodeMessage}
            maxLength={6}
            extra={isTimerRunning && <Timer />}
          />
        </form>
        <div style={authButtonRow}>
          <HomeTextButton text="SIGN UP" onClick={handleRegister} />
        </div>
      </div>
    </div>
  );
}

export default Register;
