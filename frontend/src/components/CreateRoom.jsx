import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRoomData, setCreatedRoomData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !username.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();
      console.log('Room created:', data);
      setCreatedRoomData(data);
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Error creating room. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRoomId = () => {
    if (createdRoomData?.roomId) {
      navigator.clipboard.writeText(createdRoomData.roomId);
      alert('Room ID copied to clipboard!');
    }
  };

  const handleEnterRoom = () => {
    if (createdRoomData?.roomId) {
      navigate(`/room/${createdRoomData.roomId}`, { state: { username } });
    }
  };

  if (createdRoomData) {
    return (
      <div className="gradient">
        <div className="container">
          <header>
            <h1>Room Created!</h1>
            <p className="subtitle">Your room is ready.</p>
          </header>

          <main className="main-content">
            <div className="form-container success-message">
              <h2>{roomName}</h2>
              <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
                Room ID: <strong>{createdRoomData.roomId}</strong>
              </p>
              
              <div className="create-room-buttons" style={{ flexDirection: 'column', gap: '1rem' }}>
                <button onClick={handleCopyRoomId} className="btn btn-secondary" style={{ width: '100%' }}>
                  Copy Room ID
                </button>
                <button onClick={handleEnterRoom} className="btn btn-primary" style={{ width: '100%' }}>
                  Enter Room
                </button>
              </div>
            </div>

            <div className="back-link">
              <Link to="/">Back to Home</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient">
      <div className="container">
        <header>
          <h1>Create Room</h1>
          <p className="subtitle">Start a new ephemeral chat session</p>
        </header>

        <main className="main-content">
          <div className="form-container">
            {error && (
              <div className="error-container">
                <p className="error-text">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="chat-form">
              <div className="form-group">
                <label htmlFor="roomName">Room Name</label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Friday Night Hangout"
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Your Nickname</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. CoolCat"
                  maxLength={20}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </div>

          <div className="back-link">
            <Link to="/">Back to Home</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateRoom;
