import { useEffect } from 'react';

const POLL_INTERVAL_MS = 10000;

const HandleFriendList = ({ fetchFriendList }) => {
  useEffect(() => {
    fetchFriendList();
    const interval = setInterval(fetchFriendList, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchFriendList]);

  return null;
};

export default HandleFriendList;
