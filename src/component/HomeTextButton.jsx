import { useState } from 'ft_react';


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
    fontSize: '48px',
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
    fontSize: '48px',
    fontWeight: '400',
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '50px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '90px',
      }}
    >
      <div>
        {isHover && (
          <img
            src="/public/images/left_arrow.png"
            alt="left_arrow"
            width={45}
            height={48}
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
            width={45}
            height={48}
          />
        )}
      </div>
    </div>
  );
}

export default HomeTextButton;
