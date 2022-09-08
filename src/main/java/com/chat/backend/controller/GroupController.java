package com.chat.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.backend.model.Group;
import com.chat.backend.service.GroupService;

@RestController
@RequestMapping("/api")
public class GroupController {

  private final GroupService groupService;

  GroupController(GroupService groupService) {
    this.groupService = groupService;
  }

  @PostMapping("/groups")
  public void addGroup(@Payload Group group) {
    groupService.addGroup(group);
  }

  @GetMapping("/groups")
  public ResponseEntity<List<Group>> getGroups() {
    return ResponseEntity.ok(groupService.getGroups());
  }

}
