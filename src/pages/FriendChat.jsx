import { useState, useCallback } from 'react';
import { FONT_SIZE, FONT_RESPONSIVE } from '../theme.js';
import { useNavigate } from 'react-router-dom';
import { addFriend, getFriendList, searchUser } from '../api/userApi.js';
import AlertCanvas from '../component/AlertCanvas.jsx';
import AlertCookie from '../component/AlertCookie';
import ChatRoom from '../component/ChatRoom.jsx';
import HandleFriendList from '../component/HandleFriendList.jsx';
import { pageFlex } from '../sharedStyles.js';

const IMG_URL = process.env.IMG_URL;

const SPACING = 16;

const chatListStyle = {
  width: '340px',
  minWidth: '280px',
  height: '100%',
  borderLeft: '1px solid rgba(0, 79, 198, 0.15)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
};

const userProfileStyle = {
  position: 'relative',
  minHeight: '48px',
  padding: `${SPACING}px ${SPACING}px 0`,
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: FONT_SIZE['2xl'],
  color: '#004FC6',
  lineHeight: 1,
};

const searchContainerStyle = { padding: SPACING, position: 'relative' };

const searchBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  borderRadius: '8px',
  border: '1px solid rgba(0, 79, 198, 0.2)',
  background: 'rgba(0, 79, 198, 0.06)',
  overflow: 'hidden',
};

const searchInputStyle = {
  flex: 1,
  minWidth: 0,
  padding: `${SPACING * 0.5}px ${SPACING * 0.75}px ${SPACING * 0.5}px 0`,
  paddingRight: SPACING,
  background: 'transparent',
  fontFamily: 'Pretendard',
  fontSize: FONT_SIZE.md,
  color: '#004FC6',
};

const searchButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: `${SPACING + 24}px`,
  height: `${SPACING + 20}px`,
  flexShrink: 0,
  color: 'rgba(0, 79, 198, 0.5)',
  fontSize: FONT_SIZE.md,
};

const searchResultsStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: SPACING * 0.25,
  backgroundColor: 'white',
  border: '1px solid rgba(0, 79, 198, 0.2)',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  zIndex: 100,
  maxHeight: '180px',
  overflowY: 'auto',
};

const messageListHeaderStyle = {
  padding: `${SPACING * 0.75}px ${SPACING}px`,
  borderBottom: '1px solid rgba(0, 79, 198, 0.15)',
  borderTop: '1px solid rgba(0, 79, 198, 0.15)',
};

const messageListStyle = { flex: 1, overflowY: 'auto' };

const chatRoomStyle = {
  flex: 1,
  minWidth: 0,
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
  gap: SPACING * 0.625,
  padding: 0,
};

const avatarContainerStyle = { position: 'relative', width: '36px', height: '36px', flexShrink: 0 };

const avatarStyle = { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' };

const statusIndicatorStyle = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  border: '1.5px solid white',
};

const nameStyle = { fontSize: FONT_SIZE.lg, fontWeight: 600, color: '#004FC6' };

const FriendChat = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [requestSentNicknames, setRequestSentNicknames] = useState(() => {
    try {
      const stored = sessionStorage.getItem('friendRequestsSent');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchNotFound(false);
    try {
      const data = await searchUser(searchQuery.trim());
      if (data && data.nickname) {
        setSearchResult(data);
        setSearchNotFound(false);
        setShowSearchResults(true);
      }
    } catch (error) {
      setSearchResult(null);
      setSearchNotFound(true);
      setShowSearchResults(true);
      console.error('Failed to search user:', error);
    }
  };

  const fetchFriendList = useCallback(async () => {
    try {
      const data = await getFriendList();
      setFriendList(data.message);
    } catch (error) {
      console.error('Failed to fetch friend list:', error);
    }
  }, []);

  const handleSendFriendRequest = async (nickname) => {
    if (isRequesting) return;
    setIsRequesting(true);
    try {
      await addFriend(nickname);
      setRequestSentNicknames((prev) => {
        const next = new Set(prev);
        next.add(nickname);
        sessionStorage.setItem('friendRequestsSent', JSON.stringify([...next]));
        return next;
      });
      alert('Friend request sent!');
      setSearchResult((r) => (r?.nickname === nickname ? { ...r, _requestSent: true } : r));
      fetchFriendList();
    } catch (error) {
      const msg = (error?.message && typeof error.message === 'string')
        ? error.message
        : (typeof error === 'string' ? error : 'Failed to send friend request. Please try again.');
      alert(msg);
      console.error('Failed to send friend request:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div style={pageFlex}>
      <HandleFriendList fetchFriendList={fetchFriendList} />
      <div style={chatRoomStyle}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            minHeight: '52px',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${SPACING * 1.25}px ${SPACING * 1.5}px ${SPACING * 1.25}px ${SPACING * 2.75}px`,
            borderBottom: '1px solid rgba(0, 79, 198, 0.15)',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '50%',
              left: SPACING,
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: 'rgba(0, 79, 198, 0.6)',
              lineHeight: 1,
            }}
            onClick={() => navigate(-1)}
          >
            ✕
          </button>
          <h1 style={{ color: '#004FC6', fontFamily: 'Pixelify Sans', fontSize: FONT_RESPONSIVE.title, lineHeight: 1, margin: 0 }}>
            Chat Room
          </h1>
          <span style={{ color: 'rgba(0, 79, 198, 0.6)', fontSize: FONT_SIZE.lg, fontWeight: 500 }}>
            {selectedChat ? selectedChat.nickname : ''}
          </span>
        </div>
        {selectedChat ? (
          <ChatRoom chatRoomId={selectedChat.chatroom_id} />
        ) : (
          <div style={skeletonStyle}>
            <img src="/public/images/Cookie.png" alt="" style={{ width: '40px', height: 'auto', marginBottom: SPACING * 0.75, opacity: 0.6, objectFit: 'contain', transform: 'rotate(8deg)' }} />
            <p style={{ fontSize: FONT_SIZE.md, opacity: 0.7 }}>Select a friend to start messaging</p>
          </div>
        )}
      </div>

      <div style={chatListStyle}>
        <div style={userProfileStyle}>
          <h2 style={{ margin: 0, fontSize: FONT_SIZE['2xl'], fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
            {sessionStorage.getItem('nickname')}
          </h2>
          <AlertCookie onClick={() => setShowAlert(true)} />
        </div>

        <div style={searchContainerStyle}>
          <div style={searchBoxStyle}>
            <button type="button" style={searchButtonStyle} onClick={handleSearch} aria-label="Search">
              <i className="fas fa-search" />
            </button>
            <input
              type="text"
              placeholder="Search by nickname"
              style={searchInputStyle}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (showSearchResults || searchNotFound) {
                  setShowSearchResults(false);
                  setSearchNotFound(false);
                }
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
            />
          </div>
          {showSearchResults && (
            <div style={{ ...searchResultsStyle, pointerEvents: 'auto' }} onClick={(e) => e.stopPropagation()}>
              {searchNotFound ? (
                <div style={{ padding: `${SPACING}px`, fontSize: FONT_SIZE.md, color: 'rgba(0,0,0,0.6)' }}>
                  User not found.
                </div>
              ) : searchResult ? (
                <div
                  role={!(friendList.some((f) => f.nickname === searchResult.nickname) || requestSentNicknames.has(searchResult.nickname) || searchResult._requestSent) && !isRequesting ? 'button' : undefined}
                  tabIndex={!(friendList.some((f) => f.nickname === searchResult.nickname) || requestSentNicknames.has(searchResult.nickname) || searchResult._requestSent) && !isRequesting ? 0 : undefined}
                  style={{
                    display: 'flex',
                    padding: `${SPACING * 0.75}px ${SPACING}px`,
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    fontSize: FONT_SIZE.md,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: SPACING * 0.5,
                    cursor: friendList.some((f) => f.nickname === searchResult.nickname) || requestSentNicknames.has(searchResult.nickname) || searchResult._requestSent || isRequesting ? 'default' : 'pointer',
                  userSelect: 'none',
                  }}
                  onClick={
                    friendList.some((f) => f.nickname === searchResult.nickname) || requestSentNicknames.has(searchResult.nickname) || searchResult._requestSent || isRequesting
                      ? undefined
                      : (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSendFriendRequest(searchResult.nickname);
                        }
                  }
                  onKeyDown={
                    friendList.some((f) => f.nickname === searchResult.nickname) || requestSentNicknames.has(searchResult.nickname) || searchResult._requestSent || isRequesting
                      ? undefined
                      : (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSendFriendRequest(searchResult.nickname);
                          }
                        }
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    {searchResult.avatar && (
                      <img src={searchResult.avatar.startsWith('http') ? searchResult.avatar : `${IMG_URL}${searchResult.avatar}`} alt="user_avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <span style={{ fontWeight: 500 }}>{searchResult.nickname}</span>
                  </div>
                  {friendList.some((f) => f.nickname === searchResult.nickname) ? (
                    <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: FONT_SIZE.sm, flexShrink: 0 }}>Friends</span>
                  ) : requestSentNicknames.has(searchResult.nickname) || searchResult._requestSent ? (
                    <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: FONT_SIZE.sm, flexShrink: 0 }}>Requested</span>
                  ) : (
                    <span style={{ color: '#004FC6', fontSize: FONT_SIZE.sm, fontWeight: 600, flexShrink: 0 }}>
                      {isRequesting ? 'Sending...' : 'Add'}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div style={messageListHeaderStyle}>
          <h3 style={{ display: 'flex', fontSize: FONT_SIZE.xl, fontWeight: 600, margin: 0, color: '#004FC6' }}>
            Friend List
          </h3>
        </div>

        <div style={messageListStyle}>
          {friendList.map((friend) => (
            <div
              key={friend.friend_id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${SPACING * 0.75}px ${SPACING}px`,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                backgroundColor: selectedChat?.chatroom_id === friend.chatroom_id ? 'rgba(0, 79, 198, 0.10)' : 'transparent',
              }}
              onClick={() =>
                setSelectedChat(
                  selectedChat?.chatroom_id === friend.chatroom_id ? null : friend
                )
              }
            >
              <div style={friendItemStyle}>
                <div style={avatarContainerStyle}>
                  <img src={`${IMG_URL}${friend.avatar}`} alt={friend.nickname} style={avatarStyle} />
                  <div style={{ ...statusIndicatorStyle, backgroundColor: friend.is_online ? '#004FC6' : 'gray' }} />
                </div>
                <span style={nameStyle}>{friend.nickname}</span>
              </div>
              <i className="fa-solid fa-message" style={{ color: 'rgba(0, 79, 198, 0.6)', fontSize: FONT_SIZE.md }} />
            </div>
          ))}
        </div>
      </div>
      <AlertCanvas
        show={showAlert}
        onClose={() => setShowAlert(false)}
        refreshList={fetchFriendList}
      />
    </div>
  );
};

export default FriendChat;
