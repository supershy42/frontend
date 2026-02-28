import { useNavigate } from 'react-router-dom';
import { FONT_SIZE } from '../theme.js';
import { joinReception } from '../api/gameApi.js';
import { acceptFriend } from '../api/userApi.js';
import { removeFriendRequest, removeGameInvites } from '../utils/store.js';
import { useStore } from '../utils/useStore.js';
import TextBanner from './TextBanner.jsx';

const SPACING = 16;
const containerStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '340px',
  minWidth: '280px',
  height: '100vh',
  backgroundColor: '#fff',
  borderLeft: '3px solid rgba(0, 79, 198, 0.20)',
  zIndex: 1050,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = { padding: `${SPACING}px 0`, display: 'flex', justifyContent: 'center', alignItems: 'center' };

const bodyStyle = { height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' };

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1040 };

const blankResult = { padding: SPACING, fontSize: FONT_SIZE.md, fontFamily: 'Pretendard', color: 'rgba(0, 0, 0, 0.5)' };

const bannerContainer = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  borderTop: '3px solid rgba(0, 79, 198, 0.20)',
  borderBottom: '3px solid rgba(0, 79, 198, 0.20)',
};

const alertBox = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${SPACING * 0.75}px ${SPACING}px`,
  backgroundColor: 'rgba(0, 79, 198, 0.10)',
  borderTop: '1.5px solid rgba(256, 256, 256, 0.90)',
  borderBottom: '1.5px solid rgba(256, 256, 256, 0.90)',
};

const textContainer = { display: 'flex', flexDirection: 'column', gap: SPACING * 0.5, padding: 0 };

const fromStyle = { fontFamily: 'Pretendard', fontSize: FONT_SIZE.lg, fontWeight: 600, margin: 0, color: '#004FC6' };

const contentText = { fontFamily: 'Pretendard', fontSize: FONT_SIZE.md, fontWeight: 500, margin: 0 };

const buttonGroup = { display: 'flex', gap: SPACING * 0.75 };

const buttonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: FONT_SIZE.md,
  color: '#004FC6',
  padding: '6px 12px',
  border: '1px solid #004FC6',
  borderRadius: '6px',
  minWidth: '36px',
};

const AlertCanvas = ({ show, onClose, refreshList }) => {
  const navigate = useNavigate();
  const { friendRequests, gameInvites, roundStartAlert, tournamentEndAlert } = useStore();

  const handleEnterGame = async (request) => {
    if (!request) return;
    try {
      await joinReception({ receptionId: request.reception_id });
      navigate(`/reception/${request.reception_id}`);
      removeGameInvites(request);
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  const handleEnterTournament = (tournamentId) => {
    if (!tournamentId) return;
    navigate(`/tournament/${tournamentId}`);
  };

  const handleAcceptFriendReq = async (request) => {
    if (!request) return;
    try {
      await acceptFriend(request.id, true);
      removeFriendRequest(request);
      refreshList?.();
      alert('Friend request accepted');
    } catch (error) {
      const msg = error?.message || 'Failed to accept friend request.';
      alert(msg);
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDeclineFriendReq = async (request) => {
    if (!request) return;
    try {
      await acceptFriend(request.id, false);
      removeFriendRequest(request);
      alert('Friend request declined');
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  if (!show) return null;

  return (
    <div>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <img src="/public/images/Cookies.png" alt="cookies_banner" style={{ width: 'auto', maxWidth: '200px', height: '18px', objectFit: 'contain' }} />
        </div>
        <div style={bodyStyle}>
          <div style={bannerContainer}>
            <TextBanner text="Game Invites" width={280} fontSize={FONT_SIZE['2xl']} />
          </div>
          {gameInvites.length > 0 ? (
            gameInvites.map((invite) => (
              <div key={`${invite.inviter}_${invite.game_name}`} style={alertBox}>
                <div style={textContainer}>
                  <p style={fromStyle}>{invite.inviter}</p>
                  <p style={contentText}>You have been invited to a game!</p>
                </div>
                <div>
                  <button className="btn btn-transparent" style={buttonStyle} onClick={() => handleEnterGame(invite)}>
                    Go
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={blankResult}>No game invites</p>
          )}

          <div style={bannerContainer}>
            <TextBanner text="Tournament" width={280} fontSize={FONT_SIZE['2xl']} />
          </div>
          {!tournamentEndAlert.length && !roundStartAlert.length && (
            <p style={blankResult}>No tournament alerts</p>
          )}
          {tournamentEndAlert.map((alert) => (
            <div key={`${alert.tournament_id}_end`} style={alertBox}>
              <div style={textContainer}>
                <p style={contentText}>{alert.name} tournament has ended.</p>
                <div>
                  <span style={contentText}>Winner: </span>
                  <span style={fromStyle}>{alert.winner}</span>
                </div>
              </div>
              <button className="btn btn-transparent" style={buttonStyle}>Go</button>
            </div>
          ))}
          {roundStartAlert.map((alert) => (
            <div key={`${alert.tournament_id}_${alert.round}`} style={alertBox}>
              <div style={textContainer}>
                <p style={{ ...contentText, fontWeight: '600' }}>
                  {alert.name} tournament round {alert.round} has started.
                </p>
              </div>
              <button
                className="btn btn-transparent"
                style={buttonStyle}
                onClick={() => handleEnterTournament(alert.tournament_id)}
              >
                Go
              </button>
            </div>
          ))}

          <div style={bannerContainer}>
            <TextBanner text="Friend Requests" width={280} fontSize={FONT_SIZE['2xl']} />
          </div>
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request.id} style={alertBox}>
                <div style={textContainer}>
                  <p style={fromStyle}>
                    {request.from_user}
                    <span style={{ fontFamily: 'Pretendard', fontSize: FONT_SIZE.md }}> wants to be your friend. Accept?</span>
                  </p>
                </div>
                <div style={buttonGroup}>
                  <button className="btn btn-transparent" style={buttonStyle} onClick={() => handleAcceptFriendReq(request)}>
                    <i className="fa-solid fa-check" />
                  </button>
                  <button className="btn btn-transparent" style={buttonStyle} onClick={() => handleDeclineFriendReq(request)}>
                    <i className="fa-solid fa-x" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={blankResult}>No friend requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCanvas;
