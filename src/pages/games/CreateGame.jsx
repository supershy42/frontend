import { useState } from 'ft_react';
import { createReception, joinReception } from '../../api/gameApi';
import Bunnies from '../../component/Bunnies';
import HomeTextButton from '../../component/HomeTextButton';

const centerBlockStyle = {
  position: 'relative',
  display: 'flex',
  width: '700px',
  padding: '80px 62.5px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '3px solid #004FC6',
  background: 'rgba(255, 255, 255, 0.80)',
  gap: '56px',
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

function CreateGame(props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    const formData = {
      name,
    };
    if (password) {
      formData.password = password;
    }

    try {
      const response = await createReception(formData);
      console.log(response);
      const receptionId = response.id;

      const joinData = {
        receptionId,
      };
      if (password) {
        joinData.password = password;
      }
      const joinResponse = await joinReception(joinData);
      console.log(joinResponse);

      props.route(`/reception/${receptionId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={centerBlockStyle}>
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '35px',
              right: '32px',
            }}
            onClick={() => {
              if (history.state?.from?.path) {
                props.route(history.state.from.path);
              } else {
                props.route('/');
              }
            }}
          ></button>
        <Bunnies />
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Game Name</label>
            <div style={inputFieldContainerStyle}>
              <div style={textFieldsStyle}>
                <input
                  type="text"
                  style={inputStyle}
                  value={name}
                  onChange={handleNameChange}
                  maxLength={20}
                  required
                />
              </div>
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <div style={inputFieldContainerStyle}>
              <div style={textFieldsStyle}>
                <input
                  type="password"
                  style={inputStyle}
                  value={password}
                  onChange={handlePasswordChange}
                  maxLength={20}
                  placeholder="비밀번호는 선택사항입니다"
                />
              </div>
            </div>
          </div>
          <span className="message" style={errorMessageStyle}></span>
          <HomeTextButton text="Create" type="submit" />
        </form>
      </div>
    </div>
  );
}

export default CreateGame;
