import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../styles/chat.css';

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const hasJoinedRef = useRef(false);

  // SessionStorage helpers
  const saveRoomState = useCallback(() => {
    sessionStorage.setItem('activeRoom', JSON.stringify({
      roomId,
      username,
      timestamp: Date.now()
    }));
  }, [roomId, username]);

  const clearRoomState = useCallback(() => {
    sessionStorage.removeItem('activeRoom');
  }, []);

  const getRoomState = useCallback(() => {
    const state = sessionStorage.getItem('activeRoom');
    return state ? JSON.parse(state) : null;
  }, []);

  // Redirect if no username
  useEffect(() => {
    if (!username) {
      const savedState = getRoomState();
      if (!savedState || savedState.roomId !== roomId) {
        navigate('/');
      }
    }
  }, [username, navigate, roomId, getRoomState]);

  // Fetch room info
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await fetch(`/api/chat/room/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setRoomInfo(data);
        } else {
          clearRoomState();
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching room info:', error);
      }
    };

    if (roomId) {
      fetchRoomInfo();
    }
  }, [roomId, navigate, clearRoomState]);

  // WebSocket message handler
  const handleIncomingMessage = useCallback((message) => {
    switch (message.type) {
      case 'CHAT':
      case 'JOIN':
      case 'LEAVE':
        setMessages((prev) => [...prev, message]);
        break;
      case 'USER_LIST':
        setUsers(message.content.split(', ').filter(u => u.trim()));
        break;
      case 'ROOM_CLOSED':
        setMessages((prev) => [...prev, message]);
        clearRoomState();
        setTimeout(() => {
          alert('Room has been closed by the host');
          navigate('/');
        }, 2000);
        break;
      default:
        break;
    }
  }, [navigate, clearRoomState]);

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  // WebSocket connection with auto-reconnect
  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    if (!username || !roomId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/chat`;
    
    console.log('Connecting to WebSocket...');
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setReconnectAttempts(0);
      setIsReconnecting(false);
      saveRoomState();
      
      // Send JOIN message
      sendMessage({
        type: 'JOIN',
        content: '',
        sender: username,
        roomId: roomId
      });
      hasJoinedRef.current = true;
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleIncomingMessage(message);
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      setIsConnected(false);
      
      // Only attempt reconnect if we have saved state and haven't deliberately left
      const savedState = getRoomState();
      if (savedState && savedState.roomId === roomId) {
        attemptReconnect();
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  }, [username, roomId, handleIncomingMessage, saveRoomState, getRoomState, sendMessage]);

  // Reconnection logic with exponential backoff
  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts >= 10) {
      console.log('Max reconnection attempts reached');
      setIsReconnecting(false);
      return;
    }

    const savedState = getRoomState();
    if (!savedState || savedState.roomId !== roomId) {
      console.log('No saved state, not reconnecting');
      return;
    }

    setIsReconnecting(true);
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/10)`);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connectWebSocket();
    }, delay);
  }, [reconnectAttempts, connectWebSocket, getRoomState, roomId]);

  // Initial WebSocket connection
  useEffect(() => {
    if (!username || !roomId) return;

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Don't close WebSocket on unmount - let visibility change handle it
    };
  }, [username, roomId, connectWebSocket]);

  // Page Visibility API - reconnect when user returns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible');
        const savedState = getRoomState();
        
        if (savedState && savedState.roomId === roomId) {
          // User returned to the tab, reconnect if not connected
          if (!isConnected && ws.current?.readyState !== WebSocket.OPEN) {
            console.log('Reconnecting after visibility change');
            setReconnectAttempts(0); // Reset attempts when user returns
            connectWebSocket();
          }
        }
      } else {
        console.log('Page became hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomId, isConnected, connectWebSocket, getRoomState]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && isConnected) {
      sendMessage({
        type: 'CHAT',
        content: inputValue.trim(),
        sender: username,
        roomId: roomId
      });
      setInputValue('');
    }
  };

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the room?')) {
      clearRoomState(); // Clear state before leaving
      sendMessage({
        type: 'LEAVE',
        content: '',
        sender: username,
        roomId: roomId
      });
      if (ws.current) {
        ws.current.close();
      }
      navigate('/');
    }
  };

  const handleCloseRoom = () => {
    if (window.confirm('Are you sure you want to close this room? All users will be disconnected.')) {
      clearRoomState();
      sendMessage({
        type: 'ROOM_CLOSED',
        content: '',
        sender: username,
        roomId: roomId
      });
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  const toggleUserList = () => {
    setIsUserListOpen(!isUserListOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (!roomInfo) {
    return <div className="loading">Loading room info...</div>;
  }

  const isHost = roomInfo.hostUsername === username;

  return (
    <>
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-left">
            <button className="back-button" onClick={handleLeave} aria-label="Leave room">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="room-info">
              <h1>{roomInfo.roomName}</h1>
              <div className="user-count" onClick={toggleUserList}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                {users.length} online
              </div>
            </div>
          </div>
          <div className="chat-header-actions">
            <ThemeToggle />
            <button className="header-icon-btn" onClick={toggleMenu} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="12" cy="19" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.type === 'CHAT' ? (msg.sender === username ? 'own-message' : '') : 'system-message'}`}
            >
              <div className="message-bubble">
                {msg.type === 'CHAT' ? (
                  <>
                    {msg.sender !== username && (
                      <div className="message-header">
                        <span className="sender">{msg.sender}</span>
                        <span className="time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                    <div className="message-content">{msg.content}</div>
                    {msg.sender === username && (
                      <div className="time" style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="message-content">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <form onSubmit={handleSendMessage} className="message-form">
            <div className="message-input-wrapper">
              <input 
                type="text" 
                placeholder="Message" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="send-button" disabled={!inputValue.trim() || !isConnected} aria-label="Send message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* User List Drawer */}
      <div className={`user-list-overlay ${isUserListOpen ? 'open' : ''}`} onClick={toggleUserList} />
      <div className={`user-list-drawer ${isUserListOpen ? 'open' : ''}`}>
        <div className="user-list-header">
          <h3>Online Users ({users.length})</h3>
          <button className="close-drawer-btn" onClick={toggleUserList} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="user-list-content">
          {users.map((user, index) => (
            <div key={index} className={`user-item ${user === username ? 'current-user' : ''}`}>
              <div className="user-avatar">{getUserInitial(user)}</div>
              <div className="user-info">
                <div className="user-name">{user}</div>
                {user === username && <div className="you-label">You</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Bottom Sheet */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} />
      <div className={`menu-bottom-sheet ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-handle" />
        <button className="menu-item" onClick={() => { copyRoomId(); setIsMenuOpen(false); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy Room ID
        </button>
        {isHost && (
          <button className="menu-item danger" onClick={() => { handleCloseRoom(); setIsMenuOpen(false); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            Close Room
          </button>
        )}
        <button className="menu-item danger" onClick={() => { handleLeave(); setIsMenuOpen(false); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Leave Room
        </button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="connection-status disconnected">
          {isReconnecting ? `Reconnecting... (${reconnectAttempts + 1}/10)` : 'Disconnected'}
        </div>
      )}
    </>
  );
};

export default ChatRoom;
