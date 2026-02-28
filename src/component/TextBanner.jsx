import { FONT_SIZE } from '../theme.js';

const textStyle = {
  fontFamily: 'Pixelify Sans',
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
  fontSize: FONT_SIZE['3xl'],
  fontWeight: '400',
  margin: '0',
};

const TextBanner = ({ text, width, fontSize }) => {
  const size = fontSize || FONT_SIZE['3xl'];
  const px = fontSize ? parseInt(String(fontSize), 10) : 24;
  const arrowSize = px <= 24 ? 28 : 45;
  return (
    <div
      style={{
        width: width ? `${width}px` : '100%',
        display: 'flex',
        height: fontSize && parseInt(fontSize) <= 24 ? '36px' : '42px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <img
        src="/public/images/down_arrow.png"
        alt="left_arrow"
        width={arrowSize}
        height={arrowSize + 3}
      />
      <h1 style={{ ...textStyle, fontSize: typeof size === 'string' ? size : `${size}px` }}>{text}</h1>
      <img
        src="/public/images/down_arrow.png"
        alt="right_arrow"
        width={arrowSize}
        height={arrowSize + 3}
      />
    </div>
  );
};

export default TextBanner;