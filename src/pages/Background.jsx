import Supereact from '../Supereact/core';

function Background() {
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#407BD4',
    opacity: 0.32,
    zIndex: -1,
  };

  const cloudStyle = {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    top: '-15vh',
    backgroundImage: 'url(/public/images/CLOUDS.png)',
    backgroundSize: '180vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'top',
  };

  const sparkleStyle = {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    top: '7vh',
    backgroundImage: 'url(/public/images/SPARKLE.png)',
    backgroundSize: '135vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'top',
  };

  const gdipStyle = {
    position: 'absolute',
    width: '120%',
    height: '100vh',
    backgroundImage: 'url(/public/images/GDIP.png)',
    backgroundSize: '90vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'bottom',
    backgroundBlendMode: 'luminosity',
  };

  const towerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    backgroundImage: 'url(/public/images/GP_TOWER.png)',
    backgroundSize: '90vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'bottom',
  };

  return (
    <div className="background" style={backgroundStyle}>
      <div className="clouds" style={cloudStyle} />
      <div className="sparkle" style={sparkleStyle} />
      <div style={{ mixBlendMode: 'screen' }}>
        <div className="gdip" style={gdipStyle} />
      </div>
      <div className="tower" style={towerStyle} />
    </div>
  );
}

export default Background;
