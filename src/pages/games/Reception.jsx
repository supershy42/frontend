import { useState, useEffect } from 'ft_react';
import HomeTextButton from '../../component/HomeTextButton';
import LoadingDots from '../../component/LoadingDots.jsx';
import ReceptionHandler from '../../component/ReceptionHandler.jsx';
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
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
};

const blinkingText = {
  fontFamily: 'Jersey 10',
  color: '#FFF',
  textAlign: 'center',
  textShadow: `
    -2px -2px 0 #004FC6,  
    2px -2px 0 #004FC6,
    -2px 2px 0 #004FC6,
    2px 2px 0 #004FC6,
    -1px -1px 0 #004FC6,
    1px -1px 0 #004FC6,
    -1px 1px 0 #004FC6,
    1px 1px 0 #004FC6
  `,
  fontSize: '32px',
  fontWeight: '400',
  animation: 'blinking 1s infinite',
};

const profileContainerStyle = {
  width: '200px',
  height: '200px',
  position: 'relative',
  borderRadius: '50%',
};

const readyProfileStyle = {
  ...profileContainerStyle,
  animation: 'glowing 1s infinite',
};

const speechBubbleStyle = {
  position: 'absolute',
  top: '-40px',
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
  textShadow: `
    -3px -3px 0 #004FC6,  
    3px -3px 0 #004FC6,
    -3px 3px 0 #004FC6,
    3px 3px 0 #004FC6
  `,
  animation: 'slideIn 2s forwards',
};

const Reception = (props) => {
  const [myself, setMyself] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);

  const [socket, setSocket] = useState(null);

  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const receptionId = history.state.id;
    const token = localStorage.getItem('access');
    if (token === null) {
      return;
    }

    const ws = new WebSocket(
      `${GAME_WS_URL}/reception/${receptionId}/?token=${token}`
    );

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);

      if (data.type === 'participants') {
        console.log('Participants:', data.message);
        const participants = data.message;
        const myself = participants.find(
          (p) => p.user_id === localStorage.getItem('user_id')
        );
        const other = participants.find(
          (p) => p.user_id !== localStorage.getItem('user_id')
        );

        setMyself(myself);
        setPlayer(other);
      } else if (data.type === 'move') {
        setReadyToStart(true);
        setTimeout(() => {
          props.route(`/arena/${receptionId}`);
        }, 2000);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => ws.close();
  }, []);

  const handleReadyClick = () => {
    if (socket && socket.readyState === WebSocket.OPEN && myself) {
      socket.send(
        JSON.stringify({
          type: 'ready',
          is_ready: !myself.is_ready,
        })
      );
    }
  };

  return (
    <div style={pageContainerStyle}>
      <TextBanner text="Waiting Room" width={500} />
      <div style={mainContainerStyle}>
        {myself ? (
          <div style={playerContainerStyle}>
            <div
              style={
                myself.is_ready ? readyProfileStyle : profileContainerStyle
              }
            >
              {myself.is_ready ? (
                <div style={speechBubbleStyle}>
                  Ready!
                  <div style={speechBubbleAfter}></div>
                </div>
              ) : (
                <div style={speechBubbleStyle}>
                  Waiting
                  <LoadingDots />
                  <div style={speechBubbleAfter}></div>
                </div>
              )}
              <img
                src={
                  myself.avatar
                    ? `${IMG_URL}${myself.avatar}`
                    : '/public/images/Spark_Profile.png'
                }
                alt="profile_img"
                width="200px"
                height="200px"
              />
            </div>
            <h2>{myself.user_name}</h2>
          </div>
        ) : null}
        {player ? (
          <div style={playerContainerStyle}>
            <div
              style={
                player.is_ready ? readyProfileStyle : profileContainerStyle
              }
            >
              {player.is_ready ? (
                <div style={speechBubbleStyle}>
                  Ready!
                  <div style={speechBubbleAfter}></div>
                </div>
              ) : (
                <div style={speechBubbleStyle}>
                  Waiting
                  <LoadingDots />
                  <div style={speechBubbleAfter}></div>
                </div>
              )}
              <img
                src={
                  player.avatar
                    ? `${IMG_URL}${player.avatar}`
                    : '/public/images/Spark_Profile.png'
                }
                alt="profile_img"
                width="200px"
              />
            </div>
            <h2>{player.user_name}</h2>
          </div>
        ) : null}
      </div>
      {player && myself ? (
        <HomeTextButton
          text={myself.is_ready ? 'Cancel Ready' : 'Get Ready'}
          onClick={() => handleReadyClick()}
        />
      ) : (
        <p style={blinkingText}>
          Waiting for another player
          <LoadingDots />
        </p>
      )}
      <div style={{ position: 'absolute', bottom: '50px' }}>
        <button
          class="btn btn-outline-dark"
          onClick={() => setShowInvite(!showInvite)}
        >
          Invite Friend
        </button>
        <FriendInviteDropup
          show={showInvite}
          onClose={() => setShowInvite(false)}
        />
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
