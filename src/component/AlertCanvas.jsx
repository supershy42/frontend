/** @jsx Supereact.createElement */
// components/OffCanvas.jsx
import { joinReception } from '../api/gameApi.js';
import { acceptFriend } from '../api/userApi.js';
import Supereact from '../Supereact/index.js';
import { removeFriendRequest, removeGameInvites } from '../utils/store.js';
import { useStore } from '../utils/useStore.js';
import TextBanner from './TextBanner.jsx';

const containerStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '460px',
  height: '100vh',
  backgroundColor: '#fff',
  borderLeft: '3px solid rgba(0, 79, 198, 0.20)',
  zIndex: 1050,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '30px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const bodyStyle = {
  height: 'calc(100vh - 90px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'scroll',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1040,
};

const blankResult = {
  padding: '20px',
  fontSize: '24px',
  color: 'rgba(0, 0, 0, 0.5)',
};

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
  padding: '20px 30px',
  backgroundColor: 'rgba(0, 79, 198, 0.10)',
  borderTop: '1.5px solid rgba(256, 256, 256, 0.90)',
  borderBottom: '1.5px solid rgba(256, 256, 256, 0.90)',
};

const textContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px 0px',
};

const fromStyle = {
  fontSize: '24px',
  fontWeight: '400',
  margin: 0,
};

const contentText = {
  fontFamily: 'Pretendard',
  fontSize: '14px',
  fontWeight: '400',
  margin: 0,
};

const buttonGroup = {
  display: 'flex',
  gap: '25px',
};

const buttonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  color: '#004FC6',
  padding: '5px 10px',
  border: '2px solid #004FC6',
  borderRadius: '0px',
  minWidth: '44px',
};

const AlertCanvas = ({ props, show, onClose, refreshList }) => {
  const { friendRequests, gameInvites, roundStartAlert, tournamentEndAlert } =
    useStore();

  const handleEnterGame = async (request) => {
    if (!request) return;
    console.log('Enter game:', request.reception_id);
    try {
      console.log('Joining game:', request.reception_id);
      const joinData = { receptionId: request.reception_id };
      const data = await joinReception(joinData);
      props.route(`/reception/${request.reception_id}`);
      removeGameInvites(request);
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  const handleEnterTournament = (tournamentId) => {
    if (!tournamentId) return;
    props.route(`/tournament/${tournamentId}`);
  };

  const handleAcceptFriendReq = async (request) => {
    if (!request) return;
    try {
      await acceptFriend(request.id, true);
      removeFriendRequest(request);
      refreshList();
      alert('Friend request accepted');
    } catch (error) {
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

  return show ? (
    <div>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <img
            src="/public/images/Cookies.png"
            alt="cookies_banner"
            style={{ width: '100%', height: '30px' }}
          />
        </div>
        <div style={bodyStyle}>
          <div style={bannerContainer}>
            <TextBanner text="Game Invites" width={400} />
          </div>
          {gameInvites.length !== 0 ? (
            gameInvites.map((invite) => (
              <div
                key={`${invite.inviter}_${invite.game_name}`}
                style={alertBox}
              >
                <div style={textContainer}>
                  <p style={fromStyle}>{invite.inviter}</p>
                  <p style={contentText}>
                    <span style={{ fontWeight: '600' }}>
                      {invite.game_name}
                    </span>
                    에 초대되었습니다!
                  </p>
                </div>
                <div>
                  <button
                    class="btn btn-transparent"
                    style={buttonStyle}
                    onClick={() => handleEnterGame(invite)}
                  >
                    Go
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={blankResult}>No game invites</p>
          )}
          <div style={bannerContainer}>
            <TextBanner text="Tournament" width={400} />
          </div>
          {!tournamentEndAlert.length && !roundStartAlert.length && (
            <p style={blankResult}>No tournament alerts</p>
          )}
          {tournamentEndAlert.length &&
            tournamentEndAlert.map((alert) => (
              <div
                key={`${alert.tournament_id}_${alert.round}`}
                style={alertBox}
              >
                <div style={textContainer}>
                  <p style={contentText}>
                    {alert.name}토너먼트가 종료되었습니다.
                  </p>
                  <div>
                    <span style={contentText}>최종</span>
                    <span style={fromStyle}> {alert.winner} </span>
                    <span style={contentText}>우승!!</span>
                  </div>
                </div>
                <button class="btn btn-transparent" style={buttonStyle}>
                  Go
                </button>
              </div>
            ))}

          {roundStartAlert &&
            roundStartAlert.map((alert) => (
              <div
                key={`${alert.tournament_id}_${alert.round}`}
                style={alertBox}
              >
                <div style={textContainer}>
                  <p style={{ ...contentText, fontWeight: '600' }}>
                    {alert.name}토너먼트의 {alert.round}라운드가 시작되었습니다.
                  </p>
                </div>
                <button
                  class="btn btn-transparent"
                  style={buttonStyle}
                  onClick={() => handleEnterTournament(alert.tournament_id)}
                >
                  Go
                </button>
              </div>
            ))}
          <div style={bannerContainer}>
            <TextBanner text="Friend Requests" width={400} />
          </div>
          {friendRequests.length !== 0 ? (
            friendRequests.map((request) => (
              <div key={request.id} style={alertBox}>
                <div style={textContainer}>
                  <p style={fromStyle}>
                    {request.from_user}
                    <span
                      style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                    >
                      의 친구요청을 수락하시겠습니까?
                    </span>
                  </p>
                </div>
                <div style={buttonGroup}>
                  <button
                    class="btn btn-transparent"
                    style={buttonStyle}
                    onClick={() => handleAcceptFriendReq(request)}
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button
                    class="btn btn-transparent"
                    style={buttonStyle}
                    onClick={() => handleDeclineFriendReq(request)}
                  >
                    <i class="fa-solid fa-x"></i>
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
  ) : (
    <div style={{ display: 'none' }}></div>
  );
};

export default AlertCanvas;
