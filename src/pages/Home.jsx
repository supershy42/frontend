import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Binky from '../component/Binky.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
import { fullSize } from '../sharedStyles.js';
import { SESSION_KEYS } from '../utils/store.js';

const centerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',
};

const buttonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'center',
};

const bingkyContainerStyle = {
  position: 'absolute',
  top: '10vh',
  right: '10vh',
};

const LOGGED_IN_BUTTONS = [
  { text: 'Create Game', action: 'CreateGame' },
  { text: 'Search Game', action: 'SearchGame' },
  { text: 'Create Tournament', action: 'CreateTournament' },
  { text: 'Search Tournament', action: 'SearchTournament' },
  { text: 'Chat', action: 'Chat' },
  { text: 'Player Option', action: 'PlayerOption' },
  { text: 'Logout', action: 'Logout' },
];

const LOGGED_OUT_BUTTONS = [
  { text: 'SIGN UP', action: 'Register' },
  { text: 'LOGIN', action: 'Login' },
];

function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(!!sessionStorage.getItem('access'));
  const buttons = isLogin ? LOGGED_IN_BUTTONS : LOGGED_OUT_BUTTONS;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastKeyboardRef = useRef(0);
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [isLogin]);

  const handleClick = useCallback((action) => {
    if (action === 'Register') {
      navigate('/register');
    } else if (action === 'Login') {
      navigate('/login');
    } else if (action === 'CreateGame') {
      navigate('/create-game');
    } else if (action === 'SearchGame') {
      navigate('/search-game');
    } else if (action === 'CreateTournament') {
      navigate('/create-tournament');
    } else if (action === 'SearchTournament') {
      navigate('/search-tournament');
    } else if (action === 'Chat') {
      navigate('/chatting');
    } else if (action === 'PlayerOption') {
      navigate('/player-option');
    } else if (action === 'Logout') {
      SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
      document.cookie =
        'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setIsLogin(false);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hoverActive) return;
        lastKeyboardRef.current = Date.now();
        setKeyboardActive(true);
        setSelectedIndex((i) => (i <= 0 ? buttons.length - 1 : i - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hoverActive) return;
        lastKeyboardRef.current = Date.now();
        setKeyboardActive(true);
        setSelectedIndex((i) => (i >= buttons.length - 1 ? 0 : i + 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleClick(buttons[selectedIndex].action);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isLogin, buttons, handleClick, hoverActive]);

  useEffect(() => {
    if (!keyboardActive) return;
    const id = setTimeout(() => setKeyboardActive(false), 600);
    return () => clearTimeout(id);
  }, [keyboardActive, selectedIndex]);

  useEffect(() => {
    if (!hoverActive) return;
    const id = setTimeout(() => setHoverActive(false), 600);
    return () => clearTimeout(id);
  }, [hoverActive, selectedIndex]);

  const handleHover = useCallback((idx) => {
    if (Date.now() - lastKeyboardRef.current < 500) return;
    setHoverActive(true);
    setSelectedIndex(idx);
  }, []);

  return (
    <div className="home_page" style={fullSize}>
      <div className="center" style={centerStyle}>
        <img
          src="/public/images/Title.png"
          alt="supershy_title"
          style={{ width: 'clamp(200px, 45vw, 500px)' }}
        />
        <div>
          <div style={buttonContainerStyle}>
            {buttons.map((btn, idx) => (
              <HomeTextButton
                key={btn.action}
                text={btn.text}
                onClick={() => handleClick(btn.action)}
                defaultActive={selectedIndex === idx}
                onHover={() => handleHover(idx)}
                keyboardSuppressesHover={keyboardActive}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={bingkyContainerStyle}>
        {isLogin && (
          <Binky isOn={false} onClick={() => navigate('/chatting')} />
        )}
      </div>
    </div>
  );
}

export default Home;
