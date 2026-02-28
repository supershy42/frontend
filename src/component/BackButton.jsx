import { backButton } from '../sharedStyles.js';

const arrowStyle = {
  width: 'clamp(22px, 3vw, 45px)',
  height: 'clamp(24px, 3.5vw, 48px)',
};

function BackButton({ onClick, alt = 'back', style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...backButton, padding: '4px', ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.7; }}
      aria-label={alt}
    >
      <img src="/public/images/right_arrow.png" alt={alt} style={arrowStyle} />
    </button>
  );
}

export default BackButton;
