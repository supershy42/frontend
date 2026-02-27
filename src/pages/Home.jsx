import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Binky from '../component/Binky.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';

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

function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(!!sessionStorage.getItem('access'));

  const handleClick = (action) => {
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
    } else if (action === 'PlayerOption') {
      navigate('/player-option');
    } else if (action === 'Logout') {
      [
        'access',
        'refresh',
        'user_id',
        'nickname',
        'email',
        'avatar',
        'friendRequests',
        'gameInvites',
        'roundStartAlert',
        'tournamentEndAlert',
      ].forEach((key) => sessionStorage.removeItem(key));
      document.cookie =
        'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setIsLogin(false);
      navigate('/');
    }
  };

  return (
    <div className="home_page" style={{ width: '100%', height: '100%' }}>
      <div className="center" style={centerStyle}>
        <img
          src="/public/images/Title.png"
          alt="supershy_title"
          style={{ width: 'clamp(200px, 45vw, 500px)' }}
        />
        <div>
          {isLogin ? (
            <div style={buttonContainerStyle}>
              <HomeTextButton
                text="Create Game"
                onClick={() => handleClick('CreateGame')}
              />
              <HomeTextButton
                text="Search Game"
                onClick={() => handleClick('SearchGame')}
              />
              <HomeTextButton
                text="Create Tournament"
                onClick={() => handleClick('CreateTournament')}
              />
              <HomeTextButton
                text="Search Tournament"
                onClick={() => handleClick('SearchTournament')}
              />
              <HomeTextButton
                text="Player Option"
                onClick={() => handleClick('PlayerOption')}
              />
              <button
                className="btn btn-transparent"
                onClick={() => handleClick('Logout')}
                style={{ fontSize: '20px', color: '#004FC6' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={buttonContainerStyle}>
              <HomeTextButton
                text="SIGN UP"
                onClick={() => handleClick('Register')}
              />
              <HomeTextButton
                text="LOGIN"
                onClick={() => handleClick('Login')}
              />
            </div>
          )}
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
