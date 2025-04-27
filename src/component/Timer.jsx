import { useState } from 'ft_react';

function Timer() {
  const [time, setTime] = useState(300);
  const timer = setInterval(() => {
    setTime((prev) => {
      clearInterval(timer);
      return prev - 1;
    });
  }, 1000);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#004FC6',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 3,
      }}
    >
      {formatTime(time)}
    </div>
  );
}

export default Timer;
