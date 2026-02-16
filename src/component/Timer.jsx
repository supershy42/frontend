import { useState, useEffect } from 'ft_react';

function Timer() {
  const [time, setTime] = useState(300);

  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: time <= 0 ? '#C60003' : '#004FC6',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 3,
      }}
    >
      {time <= 0 ? 'Expired' : formatTime(time)}
    </div>
  );
}

export default Timer;
