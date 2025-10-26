package com.ephemeralchat.service;

import com.ephemeralchat.model.ChatRoom;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import java.util.Set;

@Service
public class ChatRoomService {
    private final ConcurrentHashMap<String, ChatRoom> chatRooms = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> userToRoomMapping = new ConcurrentHashMap<>();

    public String createRoom(String roomName, String hostUsername) {
        String roomId = generateRoomId();
        ChatRoom room = new ChatRoom(roomId, roomName, hostUsername);
        chatRooms.put(roomId, room);
        return roomId;
    }

    public ChatRoom getRoomById(String roomId) {
        return chatRooms.get(roomId);
    }

    public boolean roomExists(String roomId) {
        return chatRooms.containsKey(roomId) && chatRooms.get(roomId).isActive();
    }

    public void addUserToRoom(String roomId, String username, WebSocketSession session) {
        ChatRoom room = chatRooms.get(roomId);
        if (room != null && room.isActive()) {
            room.addParticipant(username, session);
            userToRoomMapping.put(username, roomId);
        }
    }

    public void removeUserFromRoom(String username) {
        String roomId = userToRoomMapping.get(username);
        if (roomId != null) {
            ChatRoom room = chatRooms.get(roomId);
            if (room != null) {
                room.removeParticipant(username);
                userToRoomMapping.remove(username);
                
                // If room is empty, remove it
                if (room.isEmpty()) {
                    chatRooms.remove(roomId);
                }
            }
        }
    }

    public String getRoomIdByUsername(String username) {
        return userToRoomMapping.get(username);
    }

    public void closeRoom(String roomId) {
        ChatRoom room = chatRooms.get(roomId);
        if (room != null) {
            room.setActive(false);
            // Remove all users from mapping
            for (String username : room.getParticipantUsernames()) {
                userToRoomMapping.remove(username);
            }
            chatRooms.remove(roomId);
        }
    }

    public boolean isUserHost(String username, String roomId) {
        ChatRoom room = chatRooms.get(roomId);
        return room != null && room.isHost(username);
    }

    public Set<String> getActiveRooms() {
        return chatRooms.keySet();
    }

    private String generateRoomId() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}