package com.chat.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.backend.model.Group;

public interface GroupRepositrory extends JpaRepository<Group, Long>{
    
}
