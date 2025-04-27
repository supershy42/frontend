import { useState, useEffect } from 'ft_react';

const HandleFriendList = ({ fetchFriendList }) => {
  const [dep, setDep] = useState(0);
  useEffect(() => {
    try {
      fetchFriendList();
    } catch (error) {
      console.error('Failed to fetch friend list:', error);
    }
  }, [dep]);

  return <div></div>;
};

export default HandleFriendList;
