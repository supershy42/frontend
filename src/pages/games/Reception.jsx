import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeTextButton from '../../component/HomeTextButton';
import LoadingDots from '../../component/LoadingDots.jsx';
import TextBanner from '../../component/TextBanner.jsx';
import FriendInviteDropup from '../../component/FriendInviteDropup.jsx';

const IMG_URL = process.env.IMG_URL;
const GAME_WS_URL = process.env.GAME_WS_URL;

const pageContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: '100px',
};

const mainContainerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: '100px',
  marginTop: '100px',
  marginBottom: '50px',
};

const playerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const blinkingText = {
  fontFamily: 'Jersey 10',
  color: '#FFF',
  textAlign: 'center',
  textShadow: `-2px -2px 0 #004FC6, 2px -2px 0 #004FC6, -2px 2px 0 #004FC6, 2px 2px 0 #004FC6,
    -1px -1px 0 #004FC6, 1px -1px 0 #004FC6, -1px 1px 0 #004FC6, 1px 1px 0 #004FC6`,
  fontSize: '32px',
  fontWeight: '400',
  animation: 'blinking 1s infinite',
};

const profileContainerStyle = {
  width: '120px',
  height: '120px',
  position: 'relative',
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
};

const readyProfileStyle = {
  ...profileContainerStyle,
  animation: 'glowing 1s infinite',
};

const profileImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const speechBubbleStyle = {
  position: 'absolute',
  top: '-44px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#FFF',
  padding: '8px 15px',
  borderRadius: '15px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  fontSize: '20px',
  whiteSpace: 'nowrap',
  zIndex: '1',
  animation: 'blinking 1s infinite',
};

const speechBubbleAfter = {
  content: "''",
  position: 'absolute',
  bottom: '-10px',
  left: '50%',
  transform: 'translateX(-50%)',
  border: '10px solid transparent',
  borderTopColor: '#FFF',
  borderBottom: '0',
};

const gameBannerContainerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000,
  animation: 'fadeInOut 2s forwards',
};

const gameBannerStyle = {
  fontFamily: 'Jersey 10',
  color: '#FFF',
  fontSize: '64px',
  textShadow: `-3px -3px 0 #004FC6, 3px -3px 0 #004FC6, -3px 3px 0 #004FC6, 3px 3px 0 #004FC6`,
  animation: 'slideIn 2s forwards',
};

const Reception = () => {
  const navigate = useNavigate();
  const { id: receptionId } = useParams();

  const [myself, setMyself] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    const ws = new WebSocket(`${GAME_WS_URL}/reception/${receptionId}/?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'participants') {
        const participants = data.message;
        const myId = localStorage.getItem('user_id');
        const me = participants.find((p) => String(p.user_id) === String(myId));
        const other = participants.find((p) => String(p.user_id) !== String(myId));
        setMyself(me);
        setPlayer(other);
      } else if (data.type === 'move.arena') {
        setReadyToStart(true);
        setTimeout(() => navigate(`/arena/${data.arena_id}`), 2000);
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => ws.close();
  }, [receptionId]);

  const handleReadyClick = () => {
    if (socket && socket.readyState === WebSocket.OPEN && myself) {
      socket.send(JSON.stringify({ type: 'ready', is_ready: !myself.is_ready }));
    }
  };

  return (
    <div style={pageContainerStyle}>
      <TextBanner text="Waiting Room" width={500} />
      <div style={mainContainerStyle}>
        {myself && (
          <div style={playerContainerStyle}>
            <div style={myself.is_ready ? readyProfileStyle : profileContainerStyle}>
              <div style={speechBubbleStyle}>
                {myself.is_ready ? 'Ready!' : <><span>Waiting</span><LoadingDots /></>}
                <div style={speechBubbleAfter} />
              </div>
              <img
                src={myself.avatar ? `${IMG_URL}${myself.avatar}` : '/public/images/Spark_Profile.png'}
                alt="profile_img"
                style={profileImgStyle}
              />
            </div>
            <h2>{myself.nickname}</h2>
          </div>
        )}
        {player && (
          <div style={playerContainerStyle}>
            <div style={player.is_ready ? readyProfileStyle : profileContainerStyle}>
              <div style={speechBubbleStyle}>
                {player.is_ready ? 'Ready!' : <><span>Waiting</span><LoadingDots /></>}
                <div style={speechBubbleAfter} />
              </div>
              <img
                src={player.avatar ? `${IMG_URL}${player.avatar}` : '/public/images/Spark_Profile.png'}
                alt="profile_img"
                style={profileImgStyle}
              />
            </div>
            <h2>{player.nickname}</h2>
          </div>
        )}
      </div>
      {player && myself ? (
        <HomeTextButton
          text={myself.is_ready ? 'Cancel Ready' : 'Get Ready'}
          onClick={handleReadyClick}
        />
      ) : (
        <p style={blinkingText}>
          Waiting for another player<LoadingDots />
        </p>
      )}
      <div style={{ position: 'absolute', bottom: '50px' }}>
        <button className="btn btn-outline-dark" onClick={() => setShowInvite(!showInvite)}>
          Invite Friend
        </button>
        <FriendInviteDropup show={showInvite} onClose={() => setShowInvite(false)} />
      </div>
      {readyToStart && (
        <div style={gameBannerContainerStyle}>
          <div style={gameBannerStyle}>GAME START!</div>
        </div>
      )}
    </div>
  );
};

export default Reception;
