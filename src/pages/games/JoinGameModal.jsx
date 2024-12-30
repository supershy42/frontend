/** @jsx Supereact.createElement */
// JoinGameModal.jsx
import Supereact from '../../Supereact/index.js';

const JoinGameModal = ({ game, onClose, onJoin }) => {
  const [password, setPassword] = Supereact.useState('');

  const handleSubmit = async () => {
    if (!game || (game.has_password && !password)) {
      alert('Please enter the password');
      return;
    }
    await onJoin(password);
    setPassword('');
  };

  return (
    <div
      className="modal show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{game.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {game.has_password ? (
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            ) : (
              <p
                style={{ width: '100%', textAlign: 'center', fontSize: '20px' }}
              >
                Would you like to join this game?
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameModal;
