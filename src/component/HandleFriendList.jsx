/** @jsx Supereact.createElement */
import Supereact from '../Supereact/index.js';

const HandleFriendList = ({ fetchFriendList }) => {
  const [dep, setDep] = Supereact.useState(0);
  Supereact.useEffect(() => {
    try {
      fetchFriendList();
    } catch (error) {
      console.error('Failed to fetch friend list:', error);
    }
  }, [dep]);

  return <div></div>;
};

export default HandleFriendList;
