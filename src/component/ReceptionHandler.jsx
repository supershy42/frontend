import { useState, useEffect } from 'ft_react';


const GAME_WS_URL = process.env.GAME_WS_URL;

const ReceptionHandler = ({ receptionId, onStateChange, onSocketReady }) => {
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token === null) {
      return;
    }

    const ws = new WebSocket(
      `${GAME_WS_URL}/reception/${receptionId}/?token=${token}`
    );

    ws.onopen = () => {
      onStateChange({ type: 'connection', isConnected: true });
      onSocketReady(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);

      if (data.type === 'participants') {
        const participants = data.message;
        const myself = participants.find(
          (p) => p.user_id === localStorage.getItem('user_id')
        );
        const other = participants.find(
          (p) => p.user_id !== localStorage.getItem('user_id')
        );
        console.log('Myself:', myself);
        console.log('Other:', other);

        onStateChange({ type: 'participants', myself, player: other });
      } else if (data.type === 'move') {
        onStateChange({ type: 'gameStart', readyToStart: true });
      }
    };

    ws.onclose = () => {
      onStateChange({ type: 'connection', isConnected: false });
    };

    return () => ws.close();
  }, [receptionId]);

  return <div></div>;
};

export default ReceptionHandler;
