# 🚀 Ephemeral Chat

A privacy-first, real-time chat application built with Spring Boot and WebSockets. No database, no persistence, no tracking - just pure ephemeral messaging.

## ✨ Features

- **🔒 Privacy First**: Messages are never stored. Once the server shuts down or room is closed, all messages are gone forever.
- **⚡ Real-time Messaging**: Instant messaging with WebSocket technology
- **🏠 Temporary Rooms**: Create rooms on-demand with shareable room IDs
- **👥 User Management**: See who's online in real-time
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.2, WebSockets, Java 17
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Build Tool**: Maven
- **No Database**: Everything is stored in memory (HashMap-based)

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ephemeral-chat
   ```

2. **Build the application**
   ```bash
   mvn clean compile
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Open your browser**
   ```
   http://localhost:8080
   ```

## 📖 How to Use

### Creating a Room

1. Go to the home page
2. Click "Create New Room"
3. Enter your username and room name
4. Click "Create Room"
5. Share the generated Room ID with friends

### Joining a Room

1. Go to the home page
2. Click "Join Existing Room"
3. Enter your username and the Room ID
4. Click "Join Room"

### Chat Features

- **Send Messages**: Type in the message box and press Enter or click Send
- **See Online Users**: View the user list on the left sidebar
- **Share Room**: Click the Share button to copy the Room ID
- **Leave Room**: Click "Leave" to exit the room
- **Close Room** (Host only): Click "Close Room" to terminate the room for everyone

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/com/ephemeralchat/
│   │   ├── EphemeralChatApplication.java     # Main application class
│   │   ├── config/
│   │   │   └── WebSocketConfig.java          # WebSocket configuration
│   │   ├── controller/
│   │   │   └── WebController.java            # Web controllers
│   │   ├── handler/
│   │   │   └── ChatWebSocketHandler.java     # WebSocket message handler
│   │   ├── model/
│   │   │   ├── ChatMessage.java              # Message model
│   │   │   └── ChatRoom.java                 # Room model
│   │   └── service/
│   │       └── ChatRoomService.java          # Room management service
│   └── resources/
│       ├── static/css/                       # CSS files
│       ├── templates/                        # Thymeleaf templates
│       └── application.properties            # Configuration
```

## 🔧 Configuration

The application can be configured via `application.properties`:

```properties
# Change server port
server.port=8080

# Enable/disable debug logging
logging.level.com.ephemeralchat=DEBUG
```

## 🌐 API Endpoints

### Web Endpoints
- `GET /` - Home page
- `GET /create-room` - Create room page
- `POST /create-room` - Create a new room
- `GET /join-room` - Join room page
- `POST /check-room` - Check if room exists
- `GET /room/{roomId}` - Chat room page

### WebSocket Endpoint
- `WS /chat` - WebSocket connection for real-time messaging

## 💬 WebSocket Message Types

```json
{
  "type": "JOIN|CHAT|LEAVE|ROOM_CLOSED|USER_LIST",
  "content": "Message content",
  "sender": "Username",
  "roomId": "ROOM123",
  "timestamp": "2023-12-01T10:30:00"
}
```

## 🔒 Privacy & Security Features

- **No Data Persistence**: All data is stored in memory only
- **Ephemeral by Design**: Rooms disappear when empty or server restarts
- **No User Registration**: Only temporary usernames required
- **No Tracking**: No cookies, no analytics, no user tracking
- **Client-Side Only**: No server-side message storage

## 🚦 Development

### Running in Development Mode

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Building for Production

```bash
mvn clean package
java -jar target/ephemeral-chat-0.0.1-SNAPSHOT.jar
```

### Hot Reload

The application includes Spring Boot DevTools for automatic restart during development.

## 🎨 Customization

### Changing the Theme

Edit `src/main/resources/static/css/style.css` to customize colors and styling:

```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Primary button color */
.btn-primary {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}
```

### Adding Features

The modular architecture makes it easy to add new features:

1. **New Message Types**: Add to `ChatMessage.MessageType` enum
2. **New Endpoints**: Add to `WebController`
3. **UI Changes**: Modify Thymeleaf templates
4. **Business Logic**: Extend `ChatRoomService`

## 📱 Mobile Support

The application is fully responsive and works great on mobile devices:

- Touch-friendly interface
- Optimized layouts for small screens
- Swipe gestures support
- Mobile keyboard optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**WebSocket Connection Failed**
- Check if port 8080 is available
- Ensure firewall allows WebSocket connections
- Verify browser supports WebSockets

**Room Not Found**
- Rooms are ephemeral and may have been closed
- Check if the Room ID was typed correctly
- Try creating a new room

**Messages Not Appearing**
- Check browser console for errors
- Ensure WebSocket connection is established
- Try refreshing the page

### Support

If you encounter any issues, please check the browser console for error messages and feel free to open an issue on GitHub.

---

**Made with ❤️ for privacy-conscious developers**