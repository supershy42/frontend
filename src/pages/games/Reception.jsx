/** @jsx Supereact.createElement */
import HomeTextButton from '../../component/HomeTextButton';
import LoadingDots from '../../component/LoadingDots.jsx';
import TextBanner from '../../component/TextBanner.jsx';
import Supereact from '../../Supereact/index.js';

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
  const [isConnected, setIsConnected] = Supereact.useState(false);
  const [receptionId, setReceptionId] = Supereact.useState(history.state.id);
  const [socket, setSocket] = Supereact.useState(null);
  const [readyToStart, setReadyToStart] = Supereact.useState(false);

  const [myself, setMyself] = Supereact.useState(null);
  const [player, setPlayer] = Supereact.useState(null);

  Supereact.useEffect(() => {
    console.log('room id:', receptionId);

    // WebSocket 연결 설정
    const token = localStorage.getItem('access');
    if (token === null) {
      console.error('유효하지 않은 접근입니다.');
      props.route('/');
    }

    const ws = new WebSocket(
      `ws://localhost:8003/ws/reception/${receptionId}/?token=${token}`
    );

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received:', data);
      if (data.type === 'participants') {
        const participants = data.message;
        participants.forEach((participant) => {
          if (participant.user_id === localStorage.getItem('user_id')) {
            setMyself(participant);
          } else {
            setPlayer(participant);
          }
        });
      } else if (data.type === 'move') {
        setReadyToStart(true);
        setInterval(() => {
          props.route(`/arena/${receptionId}`);
        }, 2000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
      // alert('Failed to connect to the server. Please try again later.');
      // props.route('/search-game');
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    setSocket(ws);

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

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
                    ? myself.avatar
                    : '/public/images/Woorim_Profile.png'
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
                    ? player.avatar
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
        <HomeTextButton text={myself.is_ready ? 'Cancel Ready' : 'Get Ready'} />
      ) : (
        <p style={blinkingText}>
          Waiting for another player
          <LoadingDots />
        </p>
      )}
      {readyToStart && (
        <div style={gameBannerContainerStyle}>
          <div style={gameBannerStyle}>GAME START!</div>
        </div>
      )}
    </div>
  );
};

export default Reception;
