import { useState } from 'ft_react';
import { createReception, createTournament, joinReception } from '../../api/gameApi';
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

const descriptionStyle = {
    fontFamily: 'Pretendard',
    fontSize: '14px',
    color: 'rgba(0, 79, 198, 0.60)',
    marginTop: '8px',
    textAlign: 'right',
};
  
  // fieldStyle을 수정해서 설명을 포함할 수 있도록
  const fieldContainerStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

function CreateTournament(props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    const formData = {
      name,
    };

    try {
      const response = await createReception(formData);
      console.log(response);
      const tournamentId = response.id;
      props.route(`/tournament/${tournamentId}`);
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
          <div style={fieldContainerStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tournament Name</label>
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
            <div style={descriptionStyle}>
              4명의 플레이어가 모여 2라운드의 토너먼트를 진행합니다
            </div>
          </div>
          <span className="message" style={errorMessageStyle}></span>
          <HomeTextButton text="Create" type="submit" />
        </form>
      </div>
    </div>
  );
}

export default CreateTournament;
