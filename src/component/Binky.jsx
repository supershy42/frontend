/** @jsx Supereact.createElement */
import Supereact from '../Supereact';

const Binky = ({ isOn }) => {
  return (
    <button>
      <img
        src={isOn ? '/public/images/binky_on.png' : '/public/images/binky.png'}
        alt="bingky"
        style={{ width: '65px' }}
      />
    </button>
  );
};

export default Binky;
