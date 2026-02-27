import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkNickname, registerUser, verifyEmail } from '../api/userApi.js';
import Bunnies from '../component/Bunnies.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
import InputField from '../component/InputField.jsx';
import Timer from '../component/Timer.jsx';

const registerPageStyle = {
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

const verificationButtonStyle = {
  position: 'absolute',
  right: 'clamp(8px, 1.2vw, 16px)',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#004FC6',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Pretendard',
  fontSize: 'clamp(10px, 1vw, 12px)',
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
          ? 'Nickname is already in use.'
          : 'Failed to check nickname';
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
          ? '비밀번호가 일치하지 않습니다'
          : '',
    }));
  };

  const sendVerificationCode = async () => {
    if (!state.email) {
      setState((prev) => ({ ...prev, emailMessage: '이메일을 입력해주세요' }));
      return;
    }

    try {
      await verifyEmail({ email: state.email });
      setIsTimerRunning(false);
      setTimeout(() => setIsTimerRunning(true), 0);
    } catch (error) {
      if (error.status === 409) {
        setState((prev) => ({ ...prev, emailMessage: '이미 가입된 이메일입니다' }));
      } else {
        setState((prev) => ({ ...prev, emailMessage: '인증 코드 전송에 실패했습니다' }));
      }
    }
  };

  const handleRegister = async () => {
    const errors = {};
    if (!state.nickname) errors.nicknameMessage = '필수 입력 항목입니다';
    if (!state.password) errors.passwordMessage = '필수 입력 항목입니다';
    if (!state.confirmPassword) errors.passwordMessage = '필수 입력 항목입니다';
    if (!state.email) errors.emailMessage = '필수 입력 항목입니다';
    if (!state.verificationCode) errors.verificationCodeMessage = '필수 입력 항목입니다';

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, ...errors }));
      return;
    }

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({ ...prev, passwordMessage: '비밀번호가 일치하지 않습니다' }));
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
        verificationCodeMessage: 'Registration successful. Redirecting to login page...',
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
    <div className="register_page" style={registerPageStyle}>
      <div style={centerBlockStyle}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
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
        <form id="register-form" style={formStyle}>
          <InputField
            id="nickname"
            label="nickname"
            type="text"
            name="nickname"
            value={state.nickname}
            onChange={handleInputChange}
            onBlur={checkNicknameHandler}
            placeholder="최대 30자"
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
            placeholder="8자 이상 입력"
          />
          <InputField
            id="confirm-password"
            label={<span>Confirm<br />password</span>}
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleInputChange}
            onBlur={checkPasswordMatch}
            placeholder="비밀번호 재입력"
            error={state.passwordMessage}
          />
          <InputField
            id="email"
            label="e-mail"
            type="email"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            error={state.emailMessage}
          >
            <button
              type="button"
              onClick={sendVerificationCode}
              style={verificationButtonStyle}
            >
              {isTimerRunning ? '인증 재요청' : '인증 요청'}
            </button>
          </InputField>
          <InputField
            id="verification-code"
            label={<span>Verification<br />Code</span>}
            type="text"
            name="verificationCode"
            value={state.verificationCode}
            onChange={handleInputChange}
            placeholder="6자리 코드"
            error={state.verificationCodeMessage}
            maxLength={6}
            extra={isTimerRunning && <Timer />}
          />
        </form>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <HomeTextButton text="SIGN UP" onClick={handleRegister} />
        </div>
      </div>
    </div>
  );
}

export default Register;
