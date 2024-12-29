/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';
import { useStore } from '../utils/useStore.js';

const AlertCookie = ({ onClick }) => {
  const { friendRequests, gameInvites, roundStartAlert, tournamentEndAlert } =
    useStore();
  const isOn =
    friendRequests.length ||
    gameInvites.length ||
    roundStartAlert.length ||
    tournamentEndAlert.length;

  return (
    <div
      style={{
        position: 'relative',
        width: '44px',
        height: '52px',
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
      }}
      onClick={() => onClick()}
    >
      <img
        src="/public/images/Cookie.png"
        alt="alert_cookie"
        style={{
          width: '36.792px',
          height: '44px',
        }}
      />
      {isOn && (
        <img
          src="public/images/AlertDot.png"
          alt="dot"
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '17.6px',
          }}
        />
      )}
    </div>
  );
};

export default AlertCookie;
