const AlertCookie = ({ onClick }) => (
  <div
    style={{
      width: '32px',
      height: '38px',
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onClick={() => onClick()}
  >
    <img
      src="/public/images/Cookie.png"
      alt="alert_cookie"
      style={{ width: '26px', height: '30px', objectFit: 'contain' }}
    />
  </div>
);

export default AlertCookie;
