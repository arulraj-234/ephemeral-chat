import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId.trim() || !username.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/chat/check/${roomId}`);
      if (!response.ok) {
        throw new Error('Failed to check room');
      }

      const data = await response.json();
      if (data.exists) {
        navigate(`/room/${roomId}`, { state: { username } });
      } else {
        setError('Room not found or expired');
      }
    } catch (err) {
      setError('Error joining room. Please check the Room ID.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient">
      <div className="container">
        <header>
          <h1>Join Room</h1>
          <p className="subtitle">Enter a Room ID to join the conversation</p>
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
                <label htmlFor="roomId">Room ID</label>
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="e.g. A1B2C3D4"
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
                  placeholder="e.g. Guest"
                  maxLength={20}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Joining...' : 'Join Room'}
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

export default JoinRoom;
