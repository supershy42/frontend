import { useState, useEffect } from 'ft_react';


const GAME_WS_URL = process.env.GAME_WS_URL;

const arenaContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
};

const gameAreaStyle = {
  width: '800px',
  height: '600px',
  border: '3px solid #004FC6',
  backgroundColor: '#FFF',
  position: 'relative',
  overflow: 'hidden',
};

const paddleStyle = {
  position: 'absolute',
  width: '20px',
  height: '100px',
  backgroundColor: '#004FC6',
  borderRadius: '10px',
};

const scoreboardStyle = {
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
};

const playerInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const scoreStyle = {
  fontSize: '48px',
  fontFamily: 'Jersey 10',
  color: '#004FC6',
};

const playerNameStyle = {
  fontSize: '24px',
  fontFamily: 'Pretendard',
  color: '#004FC6',
};

const myTeamIndicatorStyle = {
  fontSize: '16px',
  fontFamily: 'Pretendard',
  color: '#004FC6',
  opacity: 0.7,
};

const Arena = (props) => {
  // 초기 state 설정
  const [socket, setSocket] = useState(null);
  const [team, setTeam] = useState('left'); // 테스트용으로 left팀으로 고정
  const [players, setPlayers] = useState({
    left: 'Player 1',
    right: 'Player 2',
  });
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftPaddleY, setLeftPaddleY] = useState(250);
  const [rightPaddleY, setRightPaddleY] = useState(250);

  useEffect(() => {
    const arenaId = history.state?.id;
    const token = localStorage.getItem('access');

    const ws = new WebSocket(`${GAME_WS_URL}/arena/${arenaId}/?token=${token}`);

    ws.onopen = () => {
      console.log('Arena WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received:', data);

      switch (data.type) {
        case 'team':
          setTeam(data.message);
          break;
        case 'state':
          const { left_score, right_score, left_paddle_y, right_paddle_y } =
            data.message;
          setLeftScore(left_score);
          setRightScore(right_score);
          setLeftPaddleY(left_paddle_y);
          setRightPaddleY(right_paddle_y);
          break;
        case 'arena.end':
          // 게임 종료 처리
          setTimeout(() => {
            props.route(`/reception/${data.message.url}`);
          }, 2000);
          break;
      }
    };

    ws.onclose = () => {
      console.log('Arena WebSocket Disconnected');
    };

    setSocket(ws);

    // 키보드 이벤트 리스너
    const handleKeyDown = (e) => {
      if (!socket || team === null) return;

      if (e.key === 'ArrowUp') {
        socket.send(
          JSON.stringify({
            type: 'move',
            direction: 'up',
          })
        );
      } else if (e.key === 'ArrowDown') {
        socket.send(
          JSON.stringify({
            type: 'move',
            direction: 'down',
          })
        );
      }

      // if (team === 'left') {
      //   console.log(e.key);
      //   console.log(leftPaddleY);
      //   if (e.key === 'ArrowUp') {
      //     setLeftPaddleY((prev) => Math.max(0, prev - 20));
      //   } else if (e.key === 'ArrowDown') {
      //     setLeftPaddleY((prev) => Math.min(500, prev + 20)); // 600(게임영역) - 100(패들높이)
      //   }
      // } else {
      //   if (e.key === 'ArrowUp') {
      //     setRightPaddleY((prev) => Math.max(0, prev - 20));
      //   } else if (e.key === 'ArrowDown') {
      //     setRightPaddleY((prev) => Math.min(500, prev + 20));
      //   }
      // }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div style={arenaContainerStyle}>
      <div style={gameAreaStyle}>
        <div style={scoreboardStyle}>
          <div style={playerInfoStyle}>
            <span style={playerNameStyle}>{players.left}</span>
            <span style={scoreStyle}>{leftScore}</span>
          </div>
          <div style={playerInfoStyle}>
            <span style={playerNameStyle}>{players.right}</span>
            <span style={scoreStyle}>{rightScore}</span>
          </div>
        </div>

        {/* 패들 스타일도 현재 팀에 따라 다르게 표시 */}
        <div
          style={{
            ...paddleStyle,
            left: '50px',
            top: `${leftPaddleY}px`,
            backgroundColor:
              team === 'left' ? '#004FC6' : 'rgba(0, 79, 198, 0.6)',
          }}
        />
        <div
          style={{
            ...paddleStyle,
            right: '50px',
            top: `${rightPaddleY}px`,
            backgroundColor:
              team === 'right' ? '#004FC6' : 'rgba(0, 79, 198, 0.6)',
          }}
        />
      </div>
    </div>
  );
};

export default Arena;
