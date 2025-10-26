package com.ephemeralchat.handler;

import com.ephemeralchat.model.ChatMessage;
import com.ephemeralchat.model.ChatRoom;
import com.ephemeralchat.service.ChatRoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler implements WebSocketHandler {

    @Autowired
    private ChatRoomService chatRoomService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, String> sessionToUsername = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocket connection established: " + session.getId());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String payload = message.getPayload().toString();
        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);
        
        String sessionId = session.getId();
        String username = chatMessage.getSender();
        String roomId = chatMessage.getRoomId();

        switch (chatMessage.getType()) {
            case JOIN:
                handleJoinRoom(session, chatMessage, sessionId, username, roomId);
                break;
            case CHAT:
                handleChatMessage(session, chatMessage, username, roomId);
                break;
            case LEAVE:
                handleLeaveRoom(session, username);
                break;
            case ROOM_CLOSED:
                handleCloseRoom(username, roomId);
                break;
            default:
                break;
        }
    }

    private void handleJoinRoom(WebSocketSession session, ChatMessage chatMessage, 
                               String sessionId, String username, String roomId) throws IOException {
        if (!chatRoomService.roomExists(roomId)) {
            // Send error message back to user
            ChatMessage errorMessage = new ChatMessage(ChatMessage.MessageType.CHAT, 
                "Room not found or inactive", "System", roomId);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorMessage)));
            return;
        }

        sessionToUsername.put(sessionId, username);
        chatRoomService.addUserToRoom(roomId, username, session);

        // Notify room about new user
        ChatMessage joinMessage = new ChatMessage(ChatMessage.MessageType.JOIN, 
            username + " joined the room", username, roomId);
        broadcastToRoom(roomId, joinMessage);

        // Send updated user list
        sendUserListToRoom(roomId);
    }

    private void handleChatMessage(WebSocketSession session, ChatMessage chatMessage, 
                                  String username, String roomId) throws IOException {
        if (chatRoomService.roomExists(roomId)) {
            broadcastToRoom(roomId, chatMessage);
        }
    }

    private void handleLeaveRoom(WebSocketSession session, String username) throws IOException {
        String roomId = chatRoomService.getRoomIdByUsername(username);
        if (roomId != null) {
            chatRoomService.removeUserFromRoom(username);
            sessionToUsername.remove(session.getId());

            // Notify room about user leaving
            ChatMessage leaveMessage = new ChatMessage(ChatMessage.MessageType.LEAVE, 
                username + " left the room", username, roomId);
            broadcastToRoom(roomId, leaveMessage);

            // Send updated user list
            sendUserListToRoom(roomId);
        }
    }

    private void handleCloseRoom(String username, String roomId) throws IOException {
        if (chatRoomService.isUserHost(username, roomId)) {
            // Notify all users that room is closing
            ChatMessage closeMessage = new ChatMessage(ChatMessage.MessageType.ROOM_CLOSED, 
                "Room has been closed by the host", "System", roomId);
            broadcastToRoom(roomId, closeMessage);
            
            // Close the room
            chatRoomService.closeRoom(roomId);
        }
    }

    private void broadcastToRoom(String roomId, ChatMessage message) throws IOException {
        ChatRoom room = chatRoomService.getRoomById(roomId);
        if (room != null) {
            String messageJson = objectMapper.writeValueAsString(message);
            for (WebSocketSession session : room.getParticipants().values()) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(messageJson));
                }
            }
        }
    }

    private void sendUserListToRoom(String roomId) throws IOException {
        ChatRoom room = chatRoomService.getRoomById(roomId);
        if (room != null) {
            String userList = String.join(", ", room.getParticipantUsernames());
            ChatMessage userListMessage = new ChatMessage(ChatMessage.MessageType.USER_LIST, 
                userList, "System", roomId);
            broadcastToRoom(roomId, userListMessage);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("WebSocket transport error: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        String username = sessionToUsername.get(session.getId());
        if (username != null) {
            handleLeaveRoom(session, username);
        }
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}