import { useState, useEffect } from 'ft_react';
import TextBanner from '../component/TextBanner.jsx';
import { modifyProfile } from '../api/userApi.js';
import { getMatchHistory } from '../api/gameApi.js';

const IMG_URL = process.env.IMG_URL;

const defaultAvatars = [
  '/public/images/Spark_profile.png',
  '/public/images/Suhbaek_profile.png',
  '/public/images/Woorim_profile.png',
  '/public/images/Jooahn_profile.png',
  '/public/images/Yeolee_profile.png',
];

const pageContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const leftPanelStyle = {
  width: '518px',
  height: '100%',
  padding: '40px',
  borderRight: '3px solid rgba(0, 79, 198, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '40px',
};

const profileImageStyle = {
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  objectFit: 'cover',
  margin: '0 auto',
};

const avatarGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '40px',
};

const avatarOptionStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  cursor: 'pointer',
  border: '2px solid transparent',
};

const selectedAvatarStyle = {
  ...avatarOptionStyle,
  border: '2px solid #004FC6',
};

const uploadButtonStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  border: '2px dashed #004FC6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'rgba(0, 79, 198, 0.10)',
};

const rightPanelStyle = {
  width: 'calc(100% - 518px)',
  height: '100%',
  padding: '40px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  overflowY: 'auto',
};

const matchListStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const matchCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 20px',
  backgroundColor: 'rgba(0, 79, 198, 0.05)',
  borderRadius: '10px',
  border: '1px solid rgba(0, 79, 198, 0.2)',
};

const matchResultStyle = (isWin) => ({
  padding: '5px 15px',
  borderRadius: '5px',
  backgroundColor: isWin ? '#4CAF50' : '#f44336',
  color: 'white',
  fontWeight: 'bold',
});

const matchScoreStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#004FC6',
};

const sectionTitleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#004FC6',
  marginBottom: '20px',
};

const PlayerOption = (props) => {
  const [nickname, setNickname] = useState(
    localStorage.getItem('nickname')
  );
  const [currentAvatar, setCurrentAvatar] = useState(
    `${IMG_URL}${localStorage.getItem('avatar')}`
  );
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          const data = await getMatchHistory(userId);
          setMatches(data.data || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch match history:', error);
      } finally {
        setLoadingMatches(false);
      }
    };
    fetchMatches();
  }, []);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setCurrentAvatar(avatar);
    setIsModified(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result);
        setCurrentAvatar(reader.result);
        setIsModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // 선택된 이미지가 base64 문자열이라면 파일로 변환
      if (selectedAvatar.startsWith('data:')) {
        const response = await fetch(selectedAvatar);
        const blob = await response.blob();
        formData.append('avatar', blob, 'avatar.png');
      } else {
        // 기본 이미지를 파일로 변환
        const response = await fetch(selectedAvatar);
        const blob = await response.blob();
        formData.append('avatar', blob, 'avatar.png');
      }
      formData.append('nickname', nickname);

      const data = await modifyProfile(formData);
      let avatar = data.avatar.split('/').slice(3).join('/');
      avatar = '/' + avatar;
      localStorage.setItem('avatar', avatar);
      setIsModified(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <div style={leftPanelStyle}>
        <TextBanner text={nickname} width={370} />
        <img
          src={`${currentAvatar}`}
          alt="Current Profile"
          style={profileImageStyle}
        />

        <div style={avatarGridStyle}>
          {defaultAvatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar option ${index + 1}`}
              style={
                selectedAvatar === avatar
                  ? selectedAvatarStyle
                  : avatarOptionStyle
              }
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
          <label style={uploadButtonStyle}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <i className="fas fa-plus"></i>
          </label>
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          style={{
            padding: '10px 20px',
            backgroundColor: isModified ? '#004FC6' : 'rgba(0, 79, 198, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isModified ? 'pointer' : 'default',
          }}
        >
          Update Profile
        </button>
      </div>
      <div style={rightPanelStyle}>
        <div style={sectionTitleStyle}>Match History</div>
        {loadingMatches ? (
          <div>Loading...</div>
        ) : matches.length === 0 ? (
          <div style={{ color: '#666' }}>No matches played yet</div>
        ) : (
          <div style={matchListStyle}>
            {matches.map((match, index) => {
              const userId = parseInt(localStorage.getItem('user_id'));
              const isWin = match.winner === userId;
              const isLeftPlayer = match.left_player?.id === userId;
              const opponent = isLeftPlayer ? match.right_player : match.left_player;
              const myScore = isLeftPlayer ? match.left_player_score : match.right_player_score;
              const opponentScore = isLeftPlayer ? match.right_player_score : match.left_player_score;

              return (
                <div key={index} style={matchCardStyle}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>vs {opponent?.nickname || 'Unknown'}</div>
                  </div>
                  <div style={matchScoreStyle}>{myScore} - {opponentScore}</div>
                  <div style={matchResultStyle(isWin)}>{isWin ? 'WIN' : 'LOSE'}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerOption;
