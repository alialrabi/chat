package com.chat.backend.service;

import java.util.List;

import com.chat.backend.model.Group;

public interface GroupService {
    
    public Group addGroup(Group group);

    public List<Group> getGroups();

}
