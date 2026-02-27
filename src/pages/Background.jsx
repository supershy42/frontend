
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
    top: '5vh',
    backgroundImage: 'url(/public/images/CLOUDS.png)',
    backgroundSize: '180vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'top',
  };

  const sparkleStyle = {
    position: 'absolute',
    width: '100%',
    height: '100vh',
    top: '20vh',
    backgroundImage: 'url(/public/images/SPARKLE.png)',
    backgroundSize: '135vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'top',
  };

  return (
    <div className="background" style={backgroundStyle}>
      <div className="clouds" style={cloudStyle} />
      <div className="sparkle" style={sparkleStyle} />
    </div>
  );
}

export default Background;
