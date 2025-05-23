import { jsx, useState, useEffect } from 'ft_react';
import Binky from '../component/Binky.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';

const centerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '65px',
};

const buttonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
};

const bingkyContainerStyle = {
  position: 'absolute',
  top: '10vh',
  right: '10vh',
};

function Home(props) {
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('access'));

  useEffect(() => {}, []);

  const handleClick = (action) => {
    if (action === 'Register') {
      props.route('/register');
    } else if (action === 'Login') {
      props.route('/login');
    } else if (action === 'CreateGame') {
      props.route('/create-game');
    } else if (action === 'SearchGame') {
      props.route('/search-game');
    } else if (action === 'CreateTournament') {
      props.route('/create-tournament');
    } else if (action === 'SearchTournament') {
      props.route('/search-tournament');
    } else if (action === 'PlayerOption') {
      props.route('/player-option');
    } else if (action === 'Logout') {
      localStorage.removeItem('access');
      document.cookie =
        'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setIsLogin(false);
      props.route('/');
    }
  };

  return (
    <div className="home_page" style={{ width: '100%', height: '100%' }}>
      <div className="center" style={centerStyle}>
        <img
          src="/public/images/Title.png"
          alt="supershy_title"
          style={{ width: '750px' }}
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
          <Binky isOn={false} onClick={() => props.route('/chatting')} />
        )}
      </div>
    </div>
  );
}

export default Home;
