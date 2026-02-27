import { useState } from 'react';


const JoinGameModal = ({ game, onClose, onJoin, error }) => {
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!game || (game.has_password && !password)) {
      setValidationError('Please enter the password');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);
    try {
      await onJoin(password);
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationError) setValidationError('');
                  }}
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
          {validationError && (
            <div className="alert alert-warning py-2 mx-3 mb-0" role="alert">
              {validationError}
            </div>
          )}
          {error && (
            <div className="alert alert-danger py-2 mx-3 mb-0" role="alert">
              {error}
            </div>
          )}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameModal;
