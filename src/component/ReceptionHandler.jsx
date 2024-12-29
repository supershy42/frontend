/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';

const GAME_WS_URL = process.env.GAME_WS_URL;

const ReceptionHandler = ({ receptionId, onStateChange, onSocketReady }) => {
  Supereact.useEffect(() => {
    const token = localStorage.getItem('access');
    if (token === null) {
      return;
    }

    const ws = new WebSocket(
      `${GAME_WS_URL}/reception/${receptionId}/?token=${token}`
    );

    const handleStateChange = (action) => {
      // Wrap state changes in setTimeout to ensure they're processed in the next tick
      setTimeout(() => {
        onStateChange(action);
      }, 0);
    };

    ws.onopen = () => {
      handleStateChange({ type: 'connection', isConnected: true });
      onSocketReady(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'participants') {
        const participants = data.message;
        const myself = participants.find(
          (p) => p.user_id === localStorage.getItem('user_id')
        );
        const other = participants.find(
          (p) => p.user_id !== localStorage.getItem('user_id')
        );
        handleStateChange({ type: 'participants', myself, player: other });
      } else if (data.type === 'move') {
        handleStateChange({ type: 'gameStart', readyToStart: true });
      }
    };

    ws.onclose = () => {
      handleStateChange({ type: 'connection', isConnected: false });
    };

    return () => ws.close();
  }, []);

  return <div></div>;
};

export default ReceptionHandler;
