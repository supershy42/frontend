import { useState } from 'ft_react';
import { addFriend, getFriendList, searchUser } from '../api/userApi.js';
import AlertCanvas from '../component/AlertCanvas.jsx';
import AlertCookie from '../component/AlertCookie';
import ChatRoom from '../component/ChatRoom.jsx';
import HandleFriendList from '../component/HandleFriendList.jsx';

const IMG_URL = process.env.IMG_URL;

const pageStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const chatListStyle = {
  width: '460px',
  height: '100%',
  borderLeft: '3px solid rgba(0, 79, 198, 0.20)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexDirection: 'column',
};

const userProfileStyle = {
  position: 'relative',
  height: '80px',
  padding: '20px 20px 0 20px',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '40px',
  color: '#004FC6',
  lineHeight: '82px',
};

const searchContainerStyle = {
  padding: '20px',
  position: 'relative',
};

const searchBoxStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const searchInputStyle = {
  width: '100%',
  padding: '10px 20px',
  paddingRight: '40px',
  borderRadius: '5px',
  background: 'rgba(0, 79, 198, 0.10)',
  fontFamily: 'Pretendard',
  color: '#004FC6',
};

const searchButtonStyle = {
  position: 'absolute',
  right: '12px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#004FC6',
};

const searchResultsStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: 'white',
  border: '1px solid #004FC6',
  borderTop: 'none',
  zIndex: 10,
  maxHeight: '200px',
  overflowY: 'auto',
};

const messageListHeaderStyle = {
  padding: '20px',
  borderBottom: '1px solid rgba(0, 79, 198, 0.20)',
  borderTop: '1px solid rgba(0, 79, 198, 0.20)',
};

const messageListStyle = {
  flex: 1,
  overflowY: 'auto',
};

const chatRoomStyle = {
  flex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexDirection: 'column',
};

const skeletonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#004FC6',
};

const friendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '5px 10px',
  transition: 'background-color 0.2s ease',
};

const avatarContainerStyle = {
  position: 'relative',
  width: '50px',
  height: '50px',
};

const avatarStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
};

const statusIndicatorStyle = {
  position: 'absolute',
  bottom: '0',
  right: '0',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '2px solid white',
};

const nameStyle = {
  fontSize: '24px',
  color: '#004FC6',
};

const FriendChat = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState();
  const [friendList, setFriendList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const handleSearch = async () => {
    try {
      const data = await searchUser(searchQuery);
      if (data) {
        setSearchResult(data);
        setShowSearchResults(true);
      }
    } catch (error) {
      setSearchResult({
        nickname: 'User not found',
        avatar: 'public/avatars/Spark_profile.png',
      });
      console.error('Failed to search user:', error);
    }
  };

  // 친구리스트 조회
  const fetchFriendList = async () => {
    try {
      const data = await getFriendList();
      setFriendList(data.message);
    } catch (error) {
      console.error('Failed to fetch friend list:', error);
    }
  };

  const handleSendFriendRequest = async (nickname) => {
    try {
      const data = await addFriend(nickname);

      alert('Friend request sent!');

      setSearchResult(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  return (
    <div style={pageStyle}>
      <HandleFriendList fetchFriendList={fetchFriendList} />
      <div style={chatRoomStyle}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            height: '100px',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '32px 80px',
            borderBottom: '3px solid rgba(0, 79, 198, 0.20)',
          }}
        >
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '35px',
              left: '32px',
            }}
            onClick={() => {
              if (history.state?.from?.path) {
                props.route(history.state.from.path);
              } else {
                props.route('/');
              }
            }}
          ></button>
          <h1
            style={{
              color: '#004FC6',
              fontFamily: 'Jersey 10',
              lineHeight: 0,
              margin: 0,
            }}
          >
            Chat Room
          </h1>
          <h3
            style={{
              color: 'rgba(0, 79, 198, 0.50)',
              fontSize: '24px',
              fontWeight: '400',
              lineHeight: 0,
              margin: 0,
            }}
          >
            {selectedChat ? selectedChat.user_name : ''}
          </h3>
        </div>
        {selectedChat ? (
          <ChatRoom chatRoomId={selectedChat} />
        ) : (
          // 스켈레톤 UI
          <div style={skeletonStyle}>
            <i
              className="fas fa-comments"
              style={{ fontSize: '64px', marginBottom: '20px' }}
            ></i>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>

      <div style={chatListStyle}>
        <div style={userProfileStyle}>
          <h2
            style={{
              display: 'flex',
              width: '190px',
              lineHeight: '82px',
              fontSize: '40px',
            }}
          >
            {localStorage.getItem('nickname')}
          </h2>
          <AlertCookie
            onClick={() => {
              setShowAlert(true);
            }}
          />
        </div>

        <div style={searchContainerStyle}>
          <div style={searchBoxStyle}>
            <input
              type="text"
              placeholder="Search for player..."
              style={searchInputStyle}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (showSearchResults) {
                  setShowSearchResults(false);
                }
              }}
            />
            <button style={searchButtonStyle} onClick={() => handleSearch()}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          {showSearchResults && (
            <div style={searchResultsStyle}>
              {searchResult && (
                <div
                  style={{
                    display: 'flex',
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '24px',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0px 10px',
                      gap: '12px',
                    }}
                  >
                    <img
                      src={`${IMG_URL}${searchResult.avatar}`}
                      alt="user_avatar"
                      style={{ width: '40px', height: '40px' }}
                    />
                    {searchResult.nickname}
                  </div>
                  <button
                    className="btn btn-transparent"
                    style={{
                      float: 'right',
                      color: '#004FC6',
                      fontSize: '24px',
                    }}
                    onClick={() =>
                      handleSendFriendRequest(searchResult.nickname)
                    }
                  >
                    Add Friend
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={messageListHeaderStyle}>
          <h3
            style={{
              display: 'flex',
              fontSize: '32px',
              margin: 0,
              color: '#004FC6',
            }}
          >
            Friend List
          </h3>
        </div>

        <div style={messageListStyle}>
          {/* 채팅방 목록 */}
          {friendList.map((friend) => (
            <div
              key={friend.friend_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor:
                  selectedChat === friend.chatroom_id
                    ? 'rgba(0, 79, 198, 0.10)'
                    : 'transparent',
              }}
              onClick={() => {
                if (selectedChat === friend.chatroom_id) {
                  setSelectedChat(null);
                } else {
                  setSelectedChat(friend.chatroom_id);
                }
              }}
            >
              <div style={friendItemStyle}>
                <div style={avatarContainerStyle}>
                  <img
                    src={`${IMG_URL}${friend.avatar}`}
                    alt={friend.nickname}
                    style={avatarStyle}
                  />
                  <div
                    style={{
                      ...statusIndicatorStyle,
                      backgroundColor: friend.is_online ? '#004FC6' : 'gray',
                    }}
                  />
                </div>
                <span style={nameStyle}>{friend.nickname}</span>
              </div>
              <i
                class="fa-solid fa-message"
                style={{ color: '#004FC6', fontSize: '20px' }}
              ></i>
            </div>
          ))}
        </div>
      </div>
      <AlertCanvas
        props={props}
        show={showAlert}
        onClose={() => setShowAlert(false)}
        refreshList={() => fetchFriendList}
      />
    </div>
  );
};

export default FriendChat;
