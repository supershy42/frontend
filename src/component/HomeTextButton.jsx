import { useState } from 'react';


function HomeTextButton({ text, onClick, type = 'button'}) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const defaultStyle = {
    fontFamily: 'Jersey 10',
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
    fontSize: 'clamp(24px, 3.5vw, 48px)',
    fontWeight: '400',
  };

  const hoverStyle = {
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
    fontSize: 'clamp(24px, 3.5vw, 48px)',
    fontWeight: '400',
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'clamp(30px, 4vw, 50px)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(40px, 6vw, 90px)',
      }}
    >
      <div>
        {isHover && (
          <img
            src="/public/images/left_arrow.png"
            alt="left_arrow"
            style={{ width: 'clamp(22px, 3vw, 45px)', height: 'clamp(24px, 3.5vw, 48px)' }}
          />
        )}
      </div>
      <button
        style={isHover ? hoverStyle : defaultStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
      <div>
        {isHover && (
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
