import { useState } from 'ft_react';
import { checkNickname, registerUser, verifyEmail } from '../api/userApi.js';
import Bunnies from '../component/Bunnies.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
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
  width: '700px',
  padding: '80px 62.5px',
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

const fieldStyle = {
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

const inputFieldContainerStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '318px',
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

const errorTextFieldsStyle = {
  boxShadow: '0px 4px 10px 3px rgba(198, 0, 3, 0.32) inset',
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
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: '12px',
  fontSize: '13px',
  fontFamily: 'Pretendard',
  color: 'rgba(0, 102, 198, 0.32)',
  marginTop: '4px',
};

const verificationButtonStyle = {
  position: 'absolute',
  right: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#004FC6',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Pretendard',
  fontSize: '12px',
  fontWeight: '700',
  zIndex: 3,
};

function Register(props) {
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
  const [isNicknameChecking, setIsNicknameChecking] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
  const [nicknameError, setNicknameError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Message`]: '', // 입력 변경 시 해당 필드의 에러메시지 초기화
    }));
  };

  const checkNicknameHandler = async () => {
    const nickname = state.nickname;
    if (!nickname) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    try {
      setIsNicknameChecking(true);
      const response = await checkNickname(nickname);
      setIsNicknameAvailable(true);
      setNicknameError('');
    } catch (error) {
      console.error('Nickname check error:', error);
      setIsNicknameAvailable(false);
      if (error.status === 400) {
        setNicknameError('이미 사용 중인 닉네임입니다.');
      } else {
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsNicknameChecking(false);
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
      setState((prev) => ({
        ...prev,
        emailMessage: '이메일을 입력해주세요',
      }));
      return;
    }

    try {
      await verifyEmail({ email: state.email });
      setIsTimerRunning(false);
      setTimeout(() => setIsTimerRunning(true), 0);
    } catch (error) {
      if (error.status === 409) {
        setState((prev) => ({
          ...prev,
          emailMessage: '이미 가입된 이메일입니다',
        }));
        return;
      } else {
        setState((prev) => ({
          ...prev,
          emailMessage: '인증 코드 전송에 실패했습니다',
        }));
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Starting registration process');

    // Reset error messages
    setState((prev) => ({
      ...prev,
      nicknameMessage: '',
      emailMessage: '',
      passwordMessage: '',
      verificationCodeMessage: '',
    }));

    // Validate all required fields
    if (!state.nickname) {
      setState((prev) => ({
        ...prev,
        nicknameMessage: '닉네임을 입력해주세요',
      }));
      return;
    }
    if (!state.password) {
      setState((prev) => ({
        ...prev,
        passwordMessage: '비밀번호를 입력해주세요',
      }));
      return;
    }
    if (!state.email) {
      setState((prev) => ({
        ...prev,
        emailMessage: '이메일을 입력해주세요',
      }));
      return;
    }
    if (!state.verificationCode) {
      setState((prev) => ({
        ...prev,
        verificationCodeMessage: '인증코드를 입력해주세요',
      }));
      return;
    }

    // Check if passwords match
    if (state.password !== state.confirmPassword) {
      setState((prev) => ({
        ...prev,
        passwordMessage: '비밀번호가 일치하지 않습니다',
      }));
      return;
    }

    try {
      console.log('Attempting to register with data:', {
        nickname: state.nickname,
        email: state.email,
        password: state.password,
        verificationCode: state.verificationCode,
      });

      const response = await registerUser({
        nickname: state.nickname,
        email: state.email,
        password: state.password,
        verificationCode: state.verificationCode,
      });

      console.log('Registration successful:', response);
      setState((prev) => ({
        ...prev,
        verificationCodeMessage:
          '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
      }));

      // Redirect to login page after successful registration
      setTimeout(() => {
        props.route('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.status === 400) {
        setState((prev) => ({
          ...prev,
          verificationCodeMessage:
            '입력하신 정보가 올바르지 않습니다. 다시 확인해주세요.',
        }));
      } else if (error.status === 409) {
        setState((prev) => ({
          ...prev,
          verificationCodeMessage: '이미 사용 중인 닉네임이거나 이메일입니다.',
        }));
      } else {
        setState((prev) => ({
          ...prev,
          verificationCodeMessage:
            '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
        }));
      }
    }
  };

  return (
    <div className="register_page" style={registerPageStyle}>
      <div style={centerBlockStyle}>
        <Bunnies />
        <form id="register-form" style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="nickname" style={labelStyle}>
              nickname
            </label>
            <div style={inputFieldContainerStyle}>
              <div
                style={{
                  ...textFieldsStyle,
                  ...(state.nicknameMessage ? errorTextFieldsStyle : {}),
                }}
              >
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={state.nickname}
                  onChange={handleInputChange}
                  onBlur={checkNicknameHandler}
                  style={inputStyle}
                  maxLength={30}
                />
              </div>
              <div style={errorMessageStyle}>
                {state.nicknameMessage ? state.nicknameMessage : ''}
              </div>
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
              password
            </label>
            <div style={inputFieldContainerStyle}>
              <div
                style={{
                  ...textFieldsStyle,
                  ...(state.passwordMessage ? errorTextFieldsStyle : {}),
                }}
              >
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={state.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호"
                />
                <div
                  className="password-requirements"
                  style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}
                >
                  비밀번호는 다음 조건을 만족해야 합니다: • 최소 8자 이상 • 영문
                  대/소문자, 숫자 포함 • 특수문자 포함 권장
                </div>
              </div>
              {state.passwordMessage && (
                <div style={errorMessageStyle}>{state.passwordMessage}</div>
              )}
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="confirm-password" style={labelStyle}>
              Confirm
              <br />
              password
            </label>
            <div style={inputFieldContainerStyle}>
              <div
                style={{
                  ...textFieldsStyle,
                  ...(state.passwordMessage ? errorTextFieldsStyle : {}),
                }}
              >
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={state.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={checkPasswordMatch}
                  style={inputStyle}
                />
              </div>
              {state.passwordMessage && (
                <div style={errorMessageStyle}>{state.passwordMessage}</div>
              )}
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              e-mail
            </label>
            <div style={inputFieldContainerStyle}>
              <div
                style={{
                  ...textFieldsStyle,
                  ...(state.emailMessage ? errorTextFieldsStyle : {}),
                }}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={state.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  style={verificationButtonStyle}
                >
                  {isTimerRunning ? '인증 재요청' : '인증 요청'}
                </button>
              </div>

              {state.emailMessage && (
                <div style={errorMessageStyle}>{state.emailMessage}</div>
              )}
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="verification-code" style={labelStyle}>
              Verification
              <br />
              Code
            </label>
            <div style={inputFieldContainerStyle}>
              <div
                style={{
                  ...textFieldsStyle,
                  ...(state.verificationCodeMessage
                    ? errorTextFieldsStyle
                    : {}),
                }}
              >
                <input
                  type="text"
                  id="verification-code"
                  name="verificationCode"
                  value={state.verificationCode}
                  onChange={handleInputChange}
                  style={inputStyle}
                  maxLength={6}
                />
              </div>
              {isTimerRunning && <Timer />}
              {state.verificationCodeMessage && (
                <div style={errorMessageStyle}>
                  {state.verificationCodeMessage}
                </div>
              )}
            </div>
          </div>

          <HomeTextButton text="SIGN UP" onClick={handleRegister} />
        </form>
      </div>
    </div>
  );
}

export default Register;
