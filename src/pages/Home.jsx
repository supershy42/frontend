import Supereact from '../Supereact/core/index.js';
import SupereactRouter from '../Supereact/router/index.js';

const { navigate } = SupereactRouter;

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
    <div className="home_page">
      {isLogin ? (
        <button onClick={() => handleClick('Logout')}>Logout</button>
      ) : (
        <>
          <button onClick={() => handleClick('Register')}>Register</button>
          <button onClick={() => handleClick('Login')}>Login</button>
        </>
      )}
    </div>
  );
}

export default Home;
