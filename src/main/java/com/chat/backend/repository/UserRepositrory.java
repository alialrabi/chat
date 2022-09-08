package com.chat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.backend.model.User;

public interface UserRepositrory extends JpaRepository<User, Long>{
    
}
