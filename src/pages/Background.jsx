/**
 * 레트로 게임 스타일 배경
 * - 그라데이션 스카이
 * - 구름/스파클 레이어
 * - 픽셀 보더 데코
 * - 스캔라인, 비네트, 노이즈 오버레이
 */

function Background() {
  const wrapperStyle = {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    zIndex: -1,
  };

  // 테마색(#004FC6) 톤에 맞춘 하늘 그라데이션
  const skyGradientStyle = {
    position: 'absolute',
    inset: 0,
    background: `
      linear-gradient(180deg,
        rgba(130, 180, 250, 0.80) 0%,
        rgba(160, 200, 250, 0.76) 30%,
        rgba(200, 225, 255, 0.72) 60%,
        rgba(230, 240, 255, 0.68) 100%
      )
    `,
  };

  const accentOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(0, 79, 198, 0.08) 0%, transparent 50%, rgba(135, 206, 250, 0.06) 100%)',
    opacity: 0.92,
  };

  const cloudWrapperStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    height: '50vh',
    overflow: 'hidden',
  };

  const cloudStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/public/images/CLOUDS.png)',
    backgroundSize: '120vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'top',
    filter: 'brightness(1.35) contrast(0.95)',
    opacity: 0.78,
    animation: 'retroCloudFloat 60s linear infinite, retroCloudBob 8s ease-in-out infinite',
  };

  const sparkleWrapperStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    height: '50vh',
    overflow: 'hidden',
  };

  const sparkleStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/public/images/SPARKLE.png)',
    backgroundSize: '85vh auto',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'top',
    filter: 'brightness(1.2)',
    animation: 'retroSparkleTwinkle 2.5s ease-in-out infinite',
  };

  // 하단 데코 (밝고 부드럽게)
  const pixelBorderStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '12vh',
    background: 'linear-gradient(0deg, rgba(0, 79, 198, 0.06) 0%, transparent 100%)',
  };

  return (
    <div className="background" style={wrapperStyle}>
      <div style={skyGradientStyle} />
      <div style={accentOverlayStyle} />
      <div style={cloudWrapperStyle}>
        <div className="clouds" style={cloudStyle} />
      </div>
      <div style={sparkleWrapperStyle}>
        <div className="sparkle" style={sparkleStyle} />
      </div>
      <div style={pixelBorderStyle} />
      <div className="retro-noise" aria-hidden="true" />
      <div className="retro-vignette" aria-hidden="true" />
      <div className="retro-scanlines" aria-hidden="true" />
    </div>
  );
}

export default Background;
