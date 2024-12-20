import Binky from '../component/Binky.jsx';
import HomeTextButton from '../component/HomeTextButton.jsx';
import Supereact from '../Supereact/core/index.js';
import SupereactRouter from '../Supereact/router/index.js';

const { navigate } = SupereactRouter;

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

function Home() {
  const [isLogin, setIsLogin] = Supereact.useState(
    !!localStorage.getItem('access')
  );

  const handleClick = (action) => {
    if (action === 'Register') {
      navigate('/register');
    } else if (action === 'Login') {
      navigate('/login');
    } else if (action === 'Logout') {
      localStorage.removeItem('access');
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
                text="Player Option"
                onClick={() => handleClick('PlayerOption')}
              />
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
        {isLogin && <Binky isOn={false} />}
      </div>
    </div>
  );
}

export default Home;
