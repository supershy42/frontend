import { useState } from 'react';
import { FONT_SIZE } from '../../theme.js';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../../api/gameApi';
import Bunnies from '../../component/Bunnies';
import HomeTextButton from '../../component/HomeTextButton';
import { pageCentered } from '../../sharedStyles.js';

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
  fontFamily: 'Pixelify Sans',
  color: '#004FC6',
  fontSize: FONT_SIZE['4xl'],
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
  fontSize: FONT_SIZE.lg,
  fontFamily: 'Pretendard',
  fontWeight: 500,
  color: '#004FC6',
  zIndex: 2,
  background: 'transparent',
  lineHeight: 'normal',
};

const errorMessageStyle = {
  fontSize: FONT_SIZE.sm,
  fontFamily: 'Pretendard',
  color: 'rgba(198, 0, 3, 0.64)',
  marginTop: '4px',
};

const descriptionStyle = {
  fontFamily: 'Pretendard',
  fontSize: FONT_SIZE.md,
  color: 'rgba(0, 79, 198, 0.6)',
  marginTop: '8px',
  textAlign: 'right',
};

const fieldContainerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

function CreateTournament() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const response = await createTournament({ name, max_participants: 4 });
      navigate(`/tournament/${response.id}`);
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to create tournament. Please try again.');
    }
  };

  return (
    <div style={pageCentered}>
      <div style={centerBlockStyle}>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          style={{ position: 'absolute', top: '35px', right: '32px' }}
          onClick={() => navigate(-1)}
        />
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
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    required
                  />
                </div>
              </div>
            </div>
            <div style={descriptionStyle}>
              4 players compete in a 2-round tournament
            </div>
          </div>
          {errorMessage && <span className="message" style={errorMessageStyle}>{errorMessage}</span>}
          <HomeTextButton text="Create" type="submit" />
        </form>
      </div>
    </div>
  );
}

export default CreateTournament;
