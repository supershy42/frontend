import { useStore } from '../utils/useStore';

const Binky = ({ onClick }) => {
  const { friendRequests, gameInvites, roundStartAlert, tournamentEndAlert } =
    useStore();
  const isOn =
    friendRequests.length ||
    gameInvites.length ||
    roundStartAlert.length ||
    tournamentEndAlert.length;

  return (
    <button onClick={onClick}>
      <img
        src={isOn ? '/public/images/binky_on.png' : '/public/images/binky.png'}
        alt="bingky"
        style={{ width: '65px' }}
      />
    </button>
  );
};

export default Binky;
