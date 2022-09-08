package com.chat.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import com.chat.backend.model.Group;
import com.chat.backend.repository.GroupRepositrory;
import com.chat.backend.service.GroupService;

@Component
public class GroupServiceImpl implements GroupService {

    private final GroupRepositrory groupRepositrory;

    GroupServiceImpl(GroupRepositrory groupRepositrory) {
        this.groupRepositrory = groupRepositrory;
    }

    @Override
    public List<Group> getGroups() {
        return groupRepositrory.findAll();
    }

    @Override
    public Group addGroup(Group group) {
        return groupRepositrory.save(group);
    }

}
