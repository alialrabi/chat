package com.chat.backend.service;

import java.util.List;

import com.chat.backend.model.User;

public interface UserService {
    
    public User addUser(User user);

    public List<User> getUsers();

}
