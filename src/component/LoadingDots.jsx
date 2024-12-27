/** @jsx Supereact.createElement */
import Supereact from '../Supereact';

const dotStyle = {
  animation: 'blink 1s infinite',
  marginLeft: '2px',
};

const LoadingDots = () => (
  <span>
    <span style={{ ...dotStyle, animationDelay: '0s' }}>.</span>
    <span style={{ ...dotStyle, animationDelay: '0.2s' }}>.</span>
    <span style={{ ...dotStyle, animationDelay: '0.4s' }}>.</span>
  </span>
);

export default LoadingDots;