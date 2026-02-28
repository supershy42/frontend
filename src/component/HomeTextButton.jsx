import { useState } from 'react';
import { FONT_RESPONSIVE } from '../theme.js';

function HomeTextButton({ text, onClick, type = 'button', defaultActive = false, onHover, keyboardSuppressesHover = false }) {
  const [isHover, setIsHover] = useState(false);
  const showHover = keyboardSuppressesHover ? defaultActive : (isHover || defaultActive);
  const handleMouseEnter = () => {
    setIsHover(true);
    onHover?.();
  };
  const handleMouseLeave = () => setIsHover(false);

  const defaultStyle = {
    fontFamily: 'Pixelify Sans',
    color: '#004FC6',
    textAlign: 'center',
    textShadow: `
    -2px -2px 0 #FFF,  
    2px -2px 0 #FFF,
    -2px 2px 0 #FFF,
    2px 2px 0 #FFF,
    -1px -1px 0 #FFF,
    1px -1px 0 #FFF,
    -1px 1px 0 #FFF,
    1px 1px 0 #FFF
  `,
    fontSize: FONT_RESPONSIVE.button,
    fontWeight: '400',
  };

  const hoverStyle = {
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
    fontSize: FONT_RESPONSIVE.button,
    fontWeight: '400',
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'clamp(30px, 4vw, 50px)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(12px, 1.2vw, 16px)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {showHover && (
          <img
            src="/public/images/left_arrow.png"
            alt="left_arrow"
            style={{ width: 'clamp(16px, 3vw, 45px)', height: 'clamp(24px, 3.5vw, 48px)' }}
          />
        )}
      </div>
      <button
        style={showHover ? hoverStyle : defaultStyle}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
      <div>
        {showHover && (
          <img
            src="/public/images/right_arrow.png"
            alt="right_arrow"
            style={{ width: 'clamp(22px, 3vw, 45px)', height: 'clamp(24px, 3.5vw, 48px)' }}
          />
        )}
      </div>
    </div>
  );
}

export default HomeTextButton;
