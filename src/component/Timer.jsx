import { useState, useEffect, useRef } from 'ft_react';

function Timer() {
  const [time, setTime] = useState(300);
  const timerRef = useRef(null);

  useEffect(() => {
    // Create interval only once on mount
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Empty dependency array - only run on mount

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
