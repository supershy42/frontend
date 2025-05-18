import { useState, useEffect, useRef } from 'ft_react';

const GAME_WS_URL = process.env.GAME_WS_URL;
const LOGIC_WIDTH = 138;
const LOGIC_HEIGHT = 76;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;

/**
 * 숫자를 주어진 범위 내로 제한하는 유틸리티 함수
 * @param {number} num - 제한할 숫자
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {number} - 제한된 숫자
 */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * 논리적 X 좌표를 화면 X 좌표로 변환
 * @param {number} x - 논리적 X 좌표 (0~LOGIC_WIDTH)
 * @returns {number} - 화면 X 좌표 (0~GAME_WIDTH)
 */
const logicToScreenX = (x) => (x / LOGIC_WIDTH) * GAME_WIDTH;

/**
 * 논리적 Y 좌표를 화면 Y 좌표로 변환
 * @param {number} y - 논리적 Y 좌표 (0~LOGIC_HEIGHT)
 * @returns {number} - 화면 Y 좌표 (0~GAME_HEIGHT)
 */
const logicToScreenY = (y) => (y / LOGIC_HEIGHT) * GAME_HEIGHT;

const arenaContainerStyle = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  gap: '30px',
};

const scoreboardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '40px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  border: '2px solid #004FC6',
  minWidth: '400px',
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
  fontWeight: 'bold',
};

const playerNameStyle = {
  fontSize: '24px',
  fontFamily: 'Pretendard',
  color: '#004FC6',
  minWidth: '120px', // 이름 영역도 고정 폭
  textAlign: 'center', // 중앙 정렬
};

const myTeamIndicatorStyle = {
  fontSize: '16px',
  fontFamily: 'Pretendard',
  color: '#004FC6',
  opacity: 0.7,
};

const messageStyle = {
  position: 'fixed',
  bottom: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '15px 30px',
  borderRadius: '8px',
  zIndex: 1000,
  fontSize: '18px',
  fontFamily: 'Pretendard',
  textAlign: 'center',
};

const debugStyle = {
  position: 'fixed',
  top: '10px',
  left: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  fontSize: '12px',
  fontFamily: 'monospace',
  zIndex: 1000,
};

const Arena = (props) => {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState({ left: null, right: null });
  const [scores, setScores] = useState({ left: 0, right: 0 });
  const [ball, setBall] = useState({ x: 0.5, y: 0.5 });
  const [paddles, setPaddles] = useState({ left: 0.5, right: 0.5 });
  const [gameState, setGameState] = useState('waiting');
  const [message, setMessage] = useState('');
  const [debug, setDebug] = useState({ ball: null, paddles: null });

  const wsRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastFrameTimeRef = useRef(0);

  // WebSocket 연결 및 메시지 처리
  useEffect(() => {
    const arenaId = history.state.id;
    if (!arenaId) return;

    wsRef.current = new WebSocket(`${GAME_WS_URL}/${arenaId}/`);

    wsRef.current.onopen = () => {
      setMessage('아레나에 입장했습니다.');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('Received WebSocket message:', data);

      switch (data.type) {
        case 'team':
          setTeam(data.message);
          break;
        case 'state':

          setPlayers(players);
          setScores(scores);
          setBall(ball);
          setPaddles(paddles);
          setGameState('playing');
          setMessage(''); // 게임 시작하면 메시지 제거

          // 디버깅 정보 업데이트
          setDebug({
            ball: ball
              ? `Logic: (${ball.x?.toFixed(1)}, ${ball.y?.toFixed(
                  1
                )}) | Screen: (${logicToScreenX(ball.x)?.toFixed(
                  1
                )}, ${logicToScreenY(ball.y)?.toFixed(1)})`
              : null,
            paddles: paddles
              ? `Logic: L=${paddles.left?.toFixed(
                  1
                )}, R=${paddles.right?.toFixed(1)} | Screen: L=${logicToScreenY(
                  paddles.left
                )?.toFixed(1)}, R=${logicToScreenY(paddles.right)?.toFixed(1)}`
              : null,
          });
          break;
        case 'countdown':
          setMessage(`게임 시작까지 ${data.message}초`);
          break;
        case 'start':
          setMessage(data.message);
          break;
        case 'arena.end':
          setGameState('finished');
          setMessage('게임 종료!');
          break;
        case 'waiting':
          setMessage(data.message);
          break;
        case 'exit':
        case 'error':
          setMessage(data.message);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    wsRef.current.onclose = () => {
      setMessage('연결이 종료되었습니다.');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // 게임 루프 최적화
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = (timestamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastFrameTimeRef.current;
      if (deltaTime >= 16) {
        // 약 60fps
        lastFrameTimeRef.current = timestamp;
        // 게임 상태 업데이트 로직
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  // 키보드 이벤트 처리=
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || !team) return;

      const direction =
        e.key === 'ArrowUp' ? 'up' : e.key === 'ArrowDown' ? 'down' : null;

      if (direction && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'move', direction }));
        console.log('Sent move:', direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, team]);

  // 위치 계산 최적화
  const paddleLeftPx = clamp(
    logicToScreenY(paddles.left ?? LOGIC_HEIGHT / 2) - PADDLE_HEIGHT / 2,
    0,
    GAME_HEIGHT - PADDLE_HEIGHT
  );
  const paddleRightPx = clamp(
    logicToScreenY(paddles.right ?? LOGIC_HEIGHT / 2) - PADDLE_HEIGHT / 2,
    0,
    GAME_HEIGHT - PADDLE_HEIGHT
  );
  const ballLeftPx = clamp(
    logicToScreenX(ball.x ?? LOGIC_WIDTH / 2) - BALL_SIZE / 2,
    0,
    GAME_WIDTH - BALL_SIZE
  );
  const ballTopPx = clamp(
    logicToScreenY(ball.y ?? LOGIC_HEIGHT / 2) - BALL_SIZE / 2,
    0,
    GAME_HEIGHT - BALL_SIZE
  );

  return (
    <div style={arenaContainerStyle}>
      {/* Debug info */}
      <div style={debugStyle}>
        <div>Ball: {debug.ball || 'N/A'}</div>
        <div>Paddles: {debug.paddles || 'N/A'}</div>
        <div>Team: {team || 'N/A'}</div>
        <div>Game State: {gameState}</div>
      </div>

      {/* Scoreboard */}
      <div style={scoreboardStyle}>
        <div style={playerInfoStyle}>
          <div style={playerNameStyle}>{players.left?.name || 'Player 1'}</div>
          <div style={scoreStyle}>{scores.left || '0'}</div>
          <div style={myTeamIndicatorStyle}>
            {team === 'left' ? '내 팀' : '\u00A0'}
          </div>
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#004FC6',
            fontWeight: 'bold',
            width: '50px',
            height: '40px',
            lineHeight: '40px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          VS
        </div>
        <div style={playerInfoStyle}>
          <div style={playerNameStyle}>{players.right?.name || 'Player 2'}</div>
          <div style={scoreStyle}>{scores.right || '0'}</div>
          <div style={myTeamIndicatorStyle}>
            {team === 'right' ? '내 팀' : '\u00A0'}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div style={gameAreaStyle}>
        {/* Paddles */}
        <div
          style={{
            ...paddleStyle,
            left: '10px',
            top: `${paddleLeftPx}px`,
          }}
        />
        <div
          style={{
            ...paddleStyle,
            right: '10px',
            top: `${paddleRightPx}px`,
          }}
        />

        {/* Ball */}
        <div
          style={{
            position: 'absolute',
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`,
            backgroundColor: '#004FC6',
            borderRadius: '50%',
            left: `${ballLeftPx}px`,
            top: `${ballTopPx}px`,
          }}
        />

        {/* Center line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            width: '2px',
            height: '100%',
            backgroundColor: '#004FC6',
            opacity: 0.3,
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Game State Message - 화면 아래쪽 */}
      {message && <div style={messageStyle}>{message}</div>}
    </div>
  );
};

export default Arena;
