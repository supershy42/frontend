/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';
import { checkNickname, registerUser, verifyEmail } from '../api/userApi.js';
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
  color: 'rgba(198, 0, 3, 0.64)',
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
  const [state, setState] = Supereact.useState({
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

  const [isTimerRunning, setIsTimerRunning] = Supereact.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setState((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Message`]: '', // 입력 변경 시 해당 필드의 에러메시지 초기화
    }));
  };

  const checkNicknameHandler = async (e) => {
    const nickname = e.target.value;
    if (!nickname) return;

    try {
      await checkNickname(nickname);
      setState((prev) => ({
        ...prev,
        nicknameMessage: '',
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        nicknameMessage: error.message,
      }));
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
    console.log('sendVerificationCode');
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
      setState((prev) => ({
        ...prev,
        emailMessage: error.message,
      }));
    }
  };

  const handleRegister = async () => {
    // console.log({
    //   nickname: state.nickname,
    //   password: state.password,
    //   confirmPassword: state.confirmPassword,
    //   email: state.email,
    //   verificationCode: state.verificationCode,
    // });
    // 모든 필수 필드 검사
    const errors = {};
    if (!state.nickname) errors.nicknameMessage = '필수 입력 항목입니다';
    if (!state.password) errors.passwordMessage = '필수 입력 항목입니다';
    if (!state.confirmPassword) errors.passwordMessage = '필수 입력 항목입니다';
    if (!state.email) errors.emailMessage = '필수 입력 항목입니다';
    if (!state.verificationCode) {
      errors.verificationCodeMessage = '필수 입력 항목입니다';
    }

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, ...errors }));
      return;
    }

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({
        ...prev,
        passwordMessage: '비밀번호가 일치하지 않습니다',
      }));
      return;
    }

    try {
      const formData = {
        nickname: state.nickname,
        password: state.password,
        email: state.email,
        code: state.verificationCode,
      };

      await registerUser(formData);
      setState((prev) => ({
        ...prev,
        verificationCodeMessage:
          'Registration successful. Redirecting to login page...',
      }));
      setTimeout(() => props.route('/login'), 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        verificationCodeMessage: error.message,
      }));
    }
  };

  return (
    <div className="register_page" style={registerPageStyle}>
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
                  style={inputStyle}
                />
              </div>
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
