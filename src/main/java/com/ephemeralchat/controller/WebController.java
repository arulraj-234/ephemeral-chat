package com.ephemeralchat.controller;

import com.ephemeralchat.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class WebController {

    @Autowired
    private ChatRoomService chatRoomService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/create-room")
    public String showCreateRoom() {
        return "create-room";
    }

    @PostMapping("/create-room")
    @ResponseBody
    public String createRoom(@RequestParam String roomName, @RequestParam String username) {
        return chatRoomService.createRoom(roomName, username);
    }

    @GetMapping("/join-room")
    public String showJoinRoom() {
        return "join-room";
    }

    @GetMapping("/room/{roomId}")
    public String chatRoom(@PathVariable String roomId, 
                          @RequestParam String username, 
                          Model model) {
        if (!chatRoomService.roomExists(roomId)) {
            model.addAttribute("error", "Room not found or no longer active");
            return "error";
        }
        
        model.addAttribute("roomId", roomId);
        model.addAttribute("username", username);
        model.addAttribute("roomInfo", chatRoomService.getRoomById(roomId));
        return "chat-room";
    }

    @PostMapping("/check-room")
    @ResponseBody
    public boolean checkRoom(@RequestParam String roomId) {
        return chatRoomService.roomExists(roomId);
    }
}