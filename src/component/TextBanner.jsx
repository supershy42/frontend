/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';

const textStyle = {
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
  fontSize: '48px',
  fontWeight: '400',
  margin: '0',
};

const TextBanner = ({ text, width }) => {
  return (
    <div
      style={{
        width: `${width}px`,
        display: 'flex',
        height: '50px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <img
        src="/public/images/down_arrow.png"
        alt="left_arrow"
        width={45}
        height={48}
      />
      <h1 style={textStyle}>{text}</h1>
      <img
        src="/public/images/down_arrow.png"
        alt="left_arrow"
        width={45}
        height={48}
      />
    </div>
  );
};

export default TextBanner;