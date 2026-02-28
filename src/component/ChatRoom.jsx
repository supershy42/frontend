import { getChattingRoom } from '../api/userApi.js';
import { FONT_SIZE } from '../theme.js';
import { useState, useEffect, useRef } from 'react';

const CHAT_WS_URL = process.env.CHAT_WS_URL || 'ws://localhost:8001/ws';
const IMG_URL = process.env.IMG_URL;
const SPACING = 20;
const BUBBLE_RADIUS = 16;
const PRIMARY = '#004FC6';

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const getMyAvatar = () => {
  const av = sessionStorage.getItem('avatar');
  if (!av) return '/public/images/Spark_profile.png';
  return av.startsWith('http') ? av : `${IMG_URL}${av}`;
};

const ChatRoom = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const chatContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(0, 79, 198, 0.03) 0%, rgba(255, 255, 255, 0.98) 100%)',
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: `${SPACING}px ${SPACING}px ${SPACING * 0.5}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING * 0.875,
    maxWidth: '640px',
    margin: '0 auto',
    width: '100%',
    minHeight: 0,
  };

  const inputWrapperStyle = {
    padding: `${SPACING * 0.75}px ${SPACING}px ${SPACING}`,
    borderTop: '1px solid rgba(0, 79, 198, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  };

  const inputRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING * 0.5,
    maxWidth: '640px',
    margin: '0 auto',
    borderRadius: '20px',
    border: '1px solid rgba(0, 79, 198, 0.2)',
    backgroundColor: 'rgba(0, 79, 198, 0.04)',
    padding: `${SPACING * 0.375}px ${SPACING * 0.5}px ${SPACING * 0.375}px ${SPACING}`,
  };

  const messageInputStyle = {
    flex: 1,
    minWidth: 0,
    background: 'transparent',
    color: PRIMARY,
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Pretendard',
    lineHeight: 1.5,
  };

  const sendButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: PRIMARY,
    color: 'white',
    flexShrink: 0,
    transition: 'opacity 0.2s, transform 0.15s',
  };

  // 이전 메시지 불러오기
  const fetchMessages = async () => {
    try {
      const data = await getChattingRoom(chatRoomId);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // 웹소켓 연결 설정
  const setupWebSocket = () => {
    const ws = new WebSocket(
      `${CHAT_WS_URL}/chat/${chatRoomId}/?token=${sessionStorage.getItem('access')}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat.message') {
        setMessages((prev) => [...prev, data]);
      }
      scrollToBottom();
    };

    ws.onerror = (e) => console.error('Chat WebSocket error:', e);
    ws.onclose = (e) => console.warn('Chat WebSocket closed:', e.code, e.reason);

    socketRef.current = ws;
    return ws;
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchMessages();
    const ws = setupWebSocket();

    return () => {
      socketRef.current = null;
      if (ws) ws.close();
    };
  }, [chatRoomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'chat',
          content: newMessage.trim(),
        })
      );
      setNewMessage('');
    } else {
      console.warn('Chat WebSocket not ready:', ws?.readyState ?? 'no socket');
    }
  };

  const MessageBubble = ({ message, isMine }) => {
    const content = message.content || '';
    const charCount = content.length;
    // 글자수에 비례해 가로 폭 계산 (대략 0.55em per char, 16px 기준)
    const minBubbleWidth = 48;
    const pxPerChar = 9;
    const calcWidth = Math.min(
      Math.max(charCount * pxPerChar + 34, minBubbleWidth),
      400
    );

    const bubbleStyle = {
      width: calcWidth,
      maxWidth: '85%',
      padding: `${SPACING * 0.65}px ${SPACING * 0.85}px`,
      borderRadius: isMine
        ? `${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px 4px ${BUBBLE_RADIUS}px`
        : `${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px ${BUBBLE_RADIUS}px 4px`,
      backgroundColor: isMine ? PRIMARY : 'rgba(0, 79, 198, 0.08)',
      color: isMine ? 'white' : PRIMARY,
      fontSize: FONT_SIZE.lg,
      lineHeight: 1.5,
      boxShadow: '0 1px 2px rgba(0, 79, 198, 0.08)',
      boxSizing: 'border-box',
    };

    const containerStyle = {
      display: 'flex',
      gap: SPACING * 0.75,
      alignSelf: isMine ? 'flex-end' : 'flex-start',
      flexDirection: isMine ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      maxWidth: '100%',
    };

    const messageContentStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignItems: isMine ? 'flex-end' : 'flex-start',
    };

    const avatarStyle = {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
      border: '2px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 1px 4px rgba(0, 79, 198, 0.15)',
    };

    const avatarSrc = isMine
      ? getMyAvatar()
      : (message.avatar || message.sender_avatar
          ? `${IMG_URL}${message.avatar || message.sender_avatar}`
          : '/public/images/Spark_profile.png');

    return (
      <div style={containerStyle}>
        <img src={avatarSrc} alt={message.sender || 'me'} style={avatarStyle} />
        <div style={messageContentStyle}>
          {!isMine && (
            <small style={{ color: PRIMARY, fontSize: FONT_SIZE.sm, fontWeight: 600, paddingLeft: 4 }}>
              {message.sender}
            </small>
          )}
          <div style={bubbleStyle}>
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'block' }}>{message.content}</span>
            <span
              style={{
                display: 'block',
                fontSize: FONT_SIZE.xs,
                opacity: isMine ? 0.85 : 0.65,
                textAlign: 'right',
                marginTop: 4,
              }}
            >
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const canSend = newMessage.trim().length > 0;

  return (
    <div style={chatContainerStyle}>
      <div style={messagesContainerStyle}>
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0, 79, 198, 0.4)',
              fontSize: FONT_SIZE.md,
              gap: SPACING * 0.5,
            }}
          >
            <img src="/public/images/Cookie.png" alt="" style={{ width: 36, height: 'auto', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Start the conversation!</p>
          </div>
        )}
        {messages.map((message, idx) => (
          <MessageBubble
            key={message.id ?? `${message.timestamp}-${idx}`}
            message={message}
            isMine={message.sender === sessionStorage.getItem('nickname')}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form style={inputWrapperStyle} onSubmit={handleSendMessage}>
        <div style={inputRowStyle}>
          <input
            type="text"
            className="chat-message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            style={messageInputStyle}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!canSend}
            style={{
              ...sendButtonStyle,
              opacity: canSend ? 1 : 0.5,
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (canSend) {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = canSend ? '1' : '0.5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <i className="fas fa-paper-plane" style={{ fontSize: FONT_SIZE.md }} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
