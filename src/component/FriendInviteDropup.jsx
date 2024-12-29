/** @jsx Supereact.createElement */
import { inviteFriend } from '../api/gameApi.js';
import { getFriendList } from '../api/userApi';
import Supereact from '../Supereact/index.js';

const FriendInviteDropup = ({ show, onClose }) => {
  const dropupStyle = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    maxHeight: '300px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '2px solid #004FC6',
    boxShadow: '0 -4px 12px rgba(0, 79, 198, 0.15)',
    marginBottom: '10px',
    overflow: 'hidden',
    display: show ? 'block' : 'none',
  };

  const headerStyle = {
    padding: '15px',
    borderBottom: '1px solid rgba(0, 79, 198, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const listContainerStyle = {
    maxHeight: '250px',
    overflowY: 'auto',
    padding: '10px 0',
  };

  const friendItemStyle = {
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const onlineIndicatorStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#004FC6',
    marginRight: '10px',
  };
  const [friends, setFriends] = Supereact.useState([]);

  const fetchFriends = async () => {
    const data = await getFriendList();
    setFriends(data.message);
  };

  const handleInvite = (friend_id) => {
    try {
      const data = inviteFriend(friend_id);
      document.getElementById('inviteToast').classList.add('show');
      setTimeout(() => {
        document.getElementById('inviteToast').classList.remove('show');
      }, 3000);
    } catch (error) {
      console.log(error);
      document.getElementById('errorToast').classList.add('show');
      setTimeout(() => {
        document.getElementById('errorToast').classList.remove('show');
      }, 3000);
      console.error(error);
    }
  };

  Supereact.useEffect(() => {
    fetchFriends();
  }, [show]);

  return (
    <div>
      <div style={dropupStyle}>
        <div style={headerStyle}>
          <span style={{ color: '#004FC6', fontWeight: 'bold' }}>
            Invite Friends
          </span>
          <button
            className="btn-close"
            onClick={onClose}
            style={{ padding: '5px' }}
          />
        </div>
        <div style={listContainerStyle}>
          {friends.map(
            (friend) =>
              friend.is_online && (
                <div key={friend.id} style={friendItemStyle}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={onlineIndicatorStyle} />
                    <span>{friend.nickname}</span>
                  </div>
                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#004FC6',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleInvite(friend.id)}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              )
          )}
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="inviteToast"
          className="toast align-items-center text-bg-primary border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">Invitation sent successfully!</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div
          id="errorToast"
          className="toast align-items-center text-bg-danger border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">Failed to send invitation</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendInviteDropup;
