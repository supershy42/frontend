/** @jsx Supereact.createElement */
// components/ChatRoom.jsx
import Supereact from '../Supereact/index.js';
import autoFetch from '../api/autoFetch.js';
import { getChattingRoom } from '../api/userApi.js';

const CHAT_WS_URL = process.env.CHAT_WS_URL;

const ChatRoom = ({ chatRoomId }) => {
  const [messages, setMessages] = Supereact.useState([]);
  const [newMessage, setNewMessage] = Supereact.useState('');
  const [socket, setSocket] = Supereact.useState(null);
  const messagesEndRef = null; // 실제 DOM 참조를 위한 ref가 있다면 사용

  const chatContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const inputContainerStyle = {
    padding: '20px',
    borderTop: '1px solid rgba(0, 79, 198, 0.20)',
    backgroundColor: 'white',
  };

  const messageInputStyle = {
    width: '100%',
    padding: '15px',
    borderRadius: '5px',
    border: '2px solid rgba(0, 79, 198, 0.20)',
    backgroundColor: 'rgba(0, 79, 198, 0.10)',
    color: '#004FC6',
  };

  // 이전 메시지 불러오기
  const fetchMessages = async () => {
    try {
      const data = await getChattingRoom(chatRoomId);
      console.log(data);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // 웹소켓 연결 설정
  const setupWebSocket = () => {
    const ws = new WebSocket(
      `${CHAT_WS_URL}/chat/${chatRoomId}/?token=${localStorage.getItem(
        'access'
      )}`
    );

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    setSocket(ws);
    return ws;
  };

  const scrollToBottom = () => {
    if (messagesEndRef) {
      messagesEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  Supereact.useEffect(() => {
    fetchMessages();
    const ws = setupWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [chatRoomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (socket) {
      console.log('socket state :', socket.readyState);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'chat',
            content: newMessage,
          })
        );
        setNewMessage('');
      }
    }
  };

  const MessageBubble = ({ message, isMine }) => {
    const bubbleStyle = {
      maxWidth: '70%',
      padding: '10px 15px',
      borderRadius: '15px',
      backgroundColor: isMine ? '#004FC6' : 'rgba(0, 79, 198, 0.10)',
      color: isMine ? 'white' : '#004FC6',
    };

    const containerStyle = {
      display: 'flex',
      gap: '10px',
      alignSelf: isMine ? 'flex-end' : 'flex-start',
      flexDirection: isMine ? 'row-reverse' : 'row',
    };

    const messageContentStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      alignItems: isMine ? 'flex-end' : 'flex-start',
    };

    const avatarStyle = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    };

    return (
      <div style={containerStyle}>
        {!isMine && (
          <img src={message.avatar} alt={message.sender} style={avatarStyle} />
        )}
        <div style={messageContentStyle}>
          {!isMine && (
            <small style={{ color: '#004FC6' }}>{message.sender}</small>
          )}
          <div style={bubbleStyle}>
            {message.content}
            <small
              style={{
                display: 'block',
                fontSize: '0.7em',
                opacity: 0.7,
                textAlign: 'right',
                marginTop: '4px',
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </small>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={chatContainerStyle}>
      <div style={messagesContainerStyle}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.sender === localStorage.getItem('nickname')}
          />
        ))}
      </div>
      <form style={inputContainerStyle} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={messageInputStyle}
        />
      </form>
    </div>
  );
};

export default ChatRoom;
