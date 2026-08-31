package com.showroom.showroom_backend.repository;

import com.showroom.showroom_backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository
        extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByStatus(String status);
}