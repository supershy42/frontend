/** @jsx Supereact.createElement */
import HomeTextButton from '../../component/HomeTextButton';
import LoadingDots from '../../component/LoadingDots.jsx';
import ReceptionHandler from '../../component/ReceptionHandler.jsx';
import TextBanner from '../../component/TextBanner.jsx';
import Supereact from '../../Supereact/index.js';
import FriendInviteDropup from '../../component/FriendInviteDropup.jsx';

const IMG_URL = process.env.IMG_URL;

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
  const [gameState, setGameState] = Supereact.useState({
    isConnected: false,
    myself: null,
    player: null,
    readyToStart: false,
  });

  const [socket, setSocket] = Supereact.useState(null);

  const [showInvite, setShowInvite] = Supereact.useState(false);

  const handleReadyClick = () => {
    if (socket && socket.readyState === WebSocket.OPEN && gameState.myself) {
      socket.send(
        JSON.stringify({
          type: 'ready',
          is_ready: !gameState.myself.is_ready,
        })
      );
    }
  };

  const handleStateChange = (action) => {
    switch (action.type) {
      case 'connection':
        console.log('connection', action.isConnected);
        setGameState((prev) => ({ ...prev, isConnected: action.isConnected }));
        break;
      case 'participants':
        console.log('participants', action.myself, action.player);
        setGameState((prev) => ({
          ...prev,
          myself: action.myself,
          player: action.player,
        }));
        break;
      case 'gameStart':
        setGameState((prev) => ({ ...prev, readyToStart: true }));
        if (action.readyToStart) {
          setTimeout(() => {
            props.route(`/arena/${history.state.id}`);
          }, 2000);
        }
        break;
    }
  };

  return (
    <div style={pageContainerStyle}>
      <ReceptionHandler
        receptionId={history.state.id}
        onStateChange={handleStateChange}
        onSocketReady={setSocket}
      />
      <TextBanner text="Waiting Room" width={500} />
      <div style={mainContainerStyle}>
        {gameState.myself ? (
          <div style={playerContainerStyle}>
            <div
              style={
                gameState.myself.is_ready
                  ? readyProfileStyle
                  : profileContainerStyle
              }
            >
              {gameState.myself.is_ready ? (
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
                  gameState.myself.avatar
                    ? `${IMG_URL}${gameState.myself.avatar}`
                    : '/public/images/Spark_Profile.png'
                }
                alt="profile_img"
                width="200px"
                height="200px"
              />
            </div>
            <h2>{gameState.myself.user_name}</h2>
          </div>
        ) : null}
        {gameState.player ? (
          <div style={playerContainerStyle}>
            <div
              style={
                gameState.player.is_ready
                  ? readyProfileStyle
                  : profileContainerStyle
              }
            >
              {gameState.player.is_ready ? (
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
                  gameState.player.avatar
                    ? `${IMG_URL}${gameState.player.avatar}`
                    : '/public/images/Spark_Profile.png'
                }
                alt="profile_img"
                width="200px"
              />
            </div>
            <h2>{gameState.player.user_name}</h2>
          </div>
        ) : null}
      </div>
      {gameState.player && gameState.myself ? (
        <HomeTextButton
          text={gameState.myself.is_ready ? 'Cancel Ready' : 'Get Ready'}
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
      {gameState.readyToStart && (
        <div style={gameBannerContainerStyle}>
          <div style={gameBannerStyle}>GAME START!</div>
        </div>
      )}
    </div>
  );
};

export default Reception;
