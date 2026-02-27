import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextBanner from '../../component/TextBanner.jsx';
import JoinGameModal from './JoinGameModal.jsx';
import { getReceptionList, joinReception } from '../../api/gameApi.js';

const centerBlockStyle = {
  position: 'relative',
  display: 'flex',
  width: '700px',
  padding: '80px 62.5px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '3px solid #004FC6',
  background: 'rgba(255, 255, 255, 0.80)',
  gap: '52px',
};

const listContainerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '20px',
  borderBottom: '1px solid #004FC6',
};

const blankBox = {
  width: '100%',
  height: '360px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
};

const SearchGame = () => {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGame, setSelectedGame] = useState(null);
  const [joinError, setJoinError] = useState(null);

  const fetchGameList = async (page) => {
    try {
      const response = await getReceptionList(page);
      setGameList(response);
    } catch (error) {
      console.error('Failed to fetch game list:', error);
    }
  };

  useEffect(() => {
    fetchGameList(1);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchGameList(newPage);
  };

  const handleJoinGame = async (password) => {
    if (!selectedGame) return;
    setJoinError(null);
    try {
      const joinData = { receptionId: selectedGame.id };
      if (password) joinData.password = password;
      await joinReception(joinData);
      setSelectedGame(null);
      navigate(`/reception/${selectedGame.id}`);
    } catch (error) {
      setJoinError(error?.message || '참가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={centerBlockStyle}>
        <button
          type="button"
          style={{
            position: 'absolute',
            top: '35px',
            right: '32px',
            background: 'transparent',
            border: 'none',
            color: '#004FC6',
            fontSize: '24px',
          }}
          onClick={() => navigate('/')}
        >
          <i className="fas fa-home" />
        </button>
        <TextBanner text="Search Game" width={370} />
        <div style={listContainerStyle}>
          <div style={buttonContainerStyle}>
            <button
              className="btn btn-transparent me-2"
              style={{ fontSize: '20px', color: '#004FC6' }}
              onClick={() => navigate('/create-game')}
            >
              Create Game
            </button>
            <button
              className="btn btn-transparent"
              onClick={() => fetchGameList(currentPage)}
              style={{ background: 'transparent', border: 'none', color: '#004FC6' }}
            >
              <i className="fas fa-sync-alt" />
            </button>
          </div>

          {gameList?.results?.length > 0 ? (
            gameList.results.map((game) => (
              <div
                key={game.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setJoinError(null);
                  setSelectedGame(game);
                }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{game.name}</h5>
                  {game.has_password ? (
                    <span className="badge bg-warning">Password</span>
                  ) : (
                    <span className="badge bg-success">Open</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={blankBox}>No game found.</div>
          )}

          <nav aria-label="Game list pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${!gameList?.previous ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!gameList?.previous}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <button className="page-link">{currentPage}</button>
              </li>
              <li className={`page-item ${!gameList?.next ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!gameList?.next}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {selectedGame && (
        <JoinGameModal
          game={selectedGame}
          onClose={() => { setSelectedGame(null); setJoinError(null); }}
          onJoin={handleJoinGame}
          error={joinError}
        />
      )}
    </div>
  );
};

export default SearchGame;
