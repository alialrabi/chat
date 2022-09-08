package com.chat.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.chat.backend.model.ChatMessage;
import com.chat.backend.model.User;
import com.chat.backend.service.UserService;

@RestController
public class ChatController {

  private SimpMessagingTemplate template;

  private final UserService userService;

  ChatController(UserService userService, SimpMessagingTemplate template) {
    this.userService = userService;
    this.template = template;
  }

  @MessageMapping("/chat.sendMessage/{group}")
  public void sendMessage(@Payload ChatMessage chatMessage, @DestinationVariable String group) {
    this.template.convertAndSend("/topic/group/" + group, chatMessage);
  }

  @MessageMapping("/chat.addUser/{group}")
  public void addUser(@Payload ChatMessage chatMessage,
      SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String group) {
    this.template.convertAndSend("/topic/group/" + group, chatMessage);
    headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
    User user = new User();
    user.setUsername(chatMessage.getSender());
    userService.addUser(user);
  }

}
