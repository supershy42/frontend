import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMatchHistory } from '../../api/gameApi';
import TextBanner from '../../component/TextBanner.jsx';
import HomeTextButton from '../../component/HomeTextButton.jsx';

const IMG_URL = process.env.IMG_URL;

const pageStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'auto',
};

const centerBlockStyle = {
  position: 'relative',
  display: 'flex',
  width: '700px',
  padding: '80px 62.5px',
  flexDirection: 'column',
  alignItems: 'center',
  border: '3px solid #004FC6',
  background: 'rgba(255, 255, 255, 0.80)',
  gap: '40px',
  margin: 'auto',
};

const outcomeStyle = (isWin) => ({
  fontFamily: 'Jersey 10',
  fontSize: '80px',
  fontWeight: '400',
  color: '#FFF',
  textShadow: isWin
    ? `-3px -3px 0 #004FC6, 3px -3px 0 #004FC6, -3px 3px 0 #004FC6, 3px 3px 0 #004FC6`
    : `-3px -3px 0 rgba(0,79,198,0.4), 3px -3px 0 rgba(0,79,198,0.4), -3px 3px 0 rgba(0,79,198,0.4), 3px 3px 0 rgba(0,79,198,0.4)`,
  lineHeight: 1,
});

const scoreRowStyle = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '48px',
};

const playerBlockStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #004FC6',
};

const avatarPlaceholderStyle = {
  ...avatarStyle,
  background: '#e8eeff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
};

const nicknameStyle = {
  fontFamily: 'Jersey 10',
  fontSize: '20px',
  fontWeight: '400',
  color: '#004FC6',
};

const bigScoreStyle = {
  fontFamily: 'Jersey 10',
  fontSize: '56px',
  fontWeight: '400',
  color: '#004FC6',
  textShadow: `-2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 2px 2px 0 #FFF`,
  lineHeight: 1,
};

const vsStyle = {
  fontFamily: 'Jersey 10',
  fontSize: '36px',
  color: '#004FC6',
  opacity: 0.35,
  lineHeight: 1,
};

const dividerStyle = {
  width: '100%',
  borderTop: '1px solid #004FC6',
  opacity: 0.2,
};

const sectionTitleStyle = {
  fontFamily: 'Jersey 10',
  fontSize: '32px',
  fontWeight: '400',
  color: '#004FC6',
  textShadow: `-2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 2px 2px 0 #FFF`,
  alignSelf: 'flex-start',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  fontFamily: 'Jersey 10',
  fontSize: '20px',
  fontWeight: '400',
  color: '#004FC6',
  textAlign: 'center',
  padding: '6px 0 10px',
  borderBottom: '1px solid #004FC6',
};

const tdBaseStyle = {
  fontFamily: 'Jersey 10',
  fontSize: '18px',
  fontWeight: '400',
  color: '#004FC6',
  textAlign: 'center',
  padding: '10px 0',
  borderBottom: '1px solid rgba(0, 79, 198, 0.2)',
};

const buttonRowStyle = {
  display: 'flex',
  gap: '48px',
  alignItems: 'center',
};

const GameResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, reception_id } = location.state || {};

  const [history, setHistory] = useState([]);
  const myId = sessionStorage.getItem('user_id');

  useEffect(() => {
    if (!myId) return;
    getMatchHistory(myId)
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [myId]);

  if (!result) {
    return (
      <div style={pageStyle}>
        <div style={centerBlockStyle}>
          <TextBanner text="Game Result" width={430} />
          <p style={{ fontFamily: 'Jersey 10', color: '#004FC6', fontSize: '24px' }}>
            No result data.
          </p>
          <HomeTextButton text="Home" onClick={() => navigate('/')} />
        </div>
      </div>
    );
  }

  const isWin = String(result.winner) === String(myId);
  const myTeam = String(result.left_player) === String(myId) ? 'left' : 'right';
  const myScore = myTeam === 'left' ? result.left_player_score : result.right_player_score;
  const oppScore = myTeam === 'left' ? result.right_player_score : result.left_player_score;
  const opponentId = myTeam === 'left' ? result.right_player : result.left_player;

  // 히스토리에서 내 정보 + 상대 정보 추출
  const findInfo = (match, targetId) => {
    if (String(match.left_player?.id) === String(targetId)) return match.left_player;
    if (String(match.right_player?.id) === String(targetId)) return match.right_player;
    return null;
  };

  const recentMatch = history.find(
    (m) => findInfo(m, myId) && findInfo(m, opponentId)
  );
  const myInfo = recentMatch ? findInfo(recentMatch, myId) : null;
  const oppInfo = recentMatch ? findInfo(recentMatch, opponentId) : null;

  return (
    <div style={pageStyle}>
      <div style={centerBlockStyle}>
        {/* 홈 버튼 */}
        <button
          type="button"
          style={{
            position: 'absolute',
            top: '35px',
            right: '32px',
            background: 'transparent',
            border: 'none',
            color: '#004FC6',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <i className="fas fa-home" />
        </button>

        {/* 타이틀 */}
        <TextBanner text="Game Result" width={430} />

        {/* 승패 텍스트 */}
        <span style={outcomeStyle(isWin)}>{isWin ? 'YOU WIN!' : 'YOU LOSE'}</span>

        {/* 스코어 */}
        <div style={scoreRowStyle}>
          <div style={playerBlockStyle}>
            {myInfo?.avatar
              ? <img src={`${IMG_URL}${myInfo.avatar}`} alt="me" style={avatarStyle} />
              : <div style={avatarPlaceholderStyle}>🐰</div>
            }
            <span style={nicknameStyle}>{myInfo?.nickname || 'Me'}</span>
            <span style={bigScoreStyle}>{myScore}</span>
          </div>

          <span style={vsStyle}>VS</span>

          <div style={playerBlockStyle}>
            {oppInfo?.avatar
              ? <img src={`${IMG_URL}${oppInfo.avatar}`} alt="opponent" style={avatarStyle} />
              : <div style={avatarPlaceholderStyle}>🐰</div>
            }
            <span style={nicknameStyle}>{oppInfo?.nickname || 'Opponent'}</span>
            <span style={bigScoreStyle}>{oppScore}</span>
          </div>
        </div>

        {/* 구분선 */}
        {history.length > 0 && <div style={dividerStyle} />}

        {/* 매치 히스토리 */}
        {history.length > 0 && (
          <>
            <span style={sectionTitleStyle}>Match History</span>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Opponent</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Result</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 3).map((match) => {
                  const isLeft = String(match.left_player?.id) === String(myId);
                  const opp = isLeft ? match.right_player : match.left_player;
                  const mSc = isLeft ? match.left_player_score : match.right_player_score;
                  const oSc = isLeft ? match.right_player_score : match.left_player_score;
                  const won = String(match.winner?.id) === String(myId);
                  const isCurrent = recentMatch && match.id === recentMatch.id;
                  return (
                    <tr key={match.id}>
                      <td style={tdBaseStyle}>{match.created_at?.slice(0, 10)}</td>
                      <td style={tdBaseStyle}>{opp?.nickname || '-'}</td>
                      <td style={{ ...tdBaseStyle, fontWeight: isCurrent ? '700' : '400' }}>
                        {mSc} : {oSc}
                      </td>
                      <td style={{
                        ...tdBaseStyle,
                        color: won ? '#004FC6' : 'rgba(0,79,198,0.4)',
                      }}>
                        {won ? 'WIN' : 'LOSE'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {/* 구분선 */}
        <div style={dividerStyle} />

        {/* 버튼 */}
        <div style={buttonRowStyle}>
          {reception_id && (
            <HomeTextButton
              text="Reception"
              onClick={() => navigate(`/reception/${reception_id}`)}
            />
          )}
          <HomeTextButton text="Home" onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default GameResult;
