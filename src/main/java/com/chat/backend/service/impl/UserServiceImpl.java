package com.chat.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import com.chat.backend.model.User;
import com.chat.backend.repository.UserRepositrory;
import com.chat.backend.service.UserService;

@Component
public class UserServiceImpl implements UserService{

    private final UserRepositrory userRepositrory;

    UserServiceImpl(UserRepositrory userRepositrory){
        this.userRepositrory = userRepositrory;
    }

    @Override
    public List<User> getUsers() {
        return userRepositrory.findAll();
    }

    @Override
    public User addUser(User user) {
        return userRepositrory.save(user);
    }
    
}
