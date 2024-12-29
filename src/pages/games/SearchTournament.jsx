/** @jsx Supereact.createElement */
import Supereact from '../../Supereact/index.js';
import TextBanner from '../../component/TextBanner.jsx';
import { getTournamentList } from '../../api/gameApi.js';

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

const SearchTournament = (props) => {
  const [tournamentList, setTournamentList] = Supereact.useState(null);
  const [currentPage, setCurrentPage] = Supereact.useState(1);

  const fetchTournamentList = async (page) => {
    try {
      const response = await getTournamentList(page);
      setTournamentList(response);
    } catch (error) {
      console.error('Failed to fetch tournament list:', error);
    }
  };

  Supereact.useEffect(() => {
    console.log('SearchGame mounted');
    fetchTournamentList(1);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchTournamentList(newPage);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={centerBlockStyle}>
      <button
          type="button"
          class="btn"
          style={{
            position: 'absolute',
            top: '35px',
            right: '32px',
            background: 'transparent',
            border: 'none',
            color: '#004FC6',
            fontSize: '24px',
          }}
          onClick={() => {
            props.route('/');
          }}
        >
          <i className="fas fa-home"></i>
        </button>
        <TextBanner text="Search Tournament" width={370} />
        <div style={listContainerStyle}>
          <div style={buttonContainerStyle}>
            <button
              className="btn btn-transparent me-2"
              style={{ fontSize: '20px', color: '#004FC6' }}
              onClick={() => props.route('/create-tournament')}
            >
              Create Tournament
            </button>
            <button
              className="btn btn-transparent"
              onClick={() => fetchTournamentList(currentPage)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#004FC6',
              }}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>

          {/* 토너먼트 리스트 */}
          {tournamentList?.results ? (
            tournamentList.results.map((tournament) => (
              <div
                key={tournament.id}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => props.route(`/tournament/${tournament.id}`)}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{tournament.name}</h5>
                  <span className="badge bg-success">View</span>
                </div>
              </div>
            ))
          ) : (
            <div style={blankBox}>No tournament found.</div>
          )}

          {/* 페이지네이션 */}
          <nav aria-label="Game list pagination">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${!tournamentList?.previous ? 'disabled' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!tournamentList?.previous}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <button className="page-link">{currentPage}</button>
              </li>
              <li className={`page-item ${!tournamentList?.next ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!tournamentList?.next}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SearchTournament;
