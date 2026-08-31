package com.showroom.showroom_backend.service;

import com.showroom.showroom_backend.dto.contact.ContactMessageRequest;
import com.showroom.showroom_backend.dto.contact.ContactMessageResponse;

import java.util.List;

public interface ContactMessageService {

    ContactMessageResponse createMessage(ContactMessageRequest request);

    List<ContactMessageResponse> getAllMessages();

    ContactMessageResponse getMessageById(Long id);

    List<ContactMessageResponse> getMessagesByStatus(String status);

    ContactMessageResponse updateMessage(
            Long id,
            ContactMessageRequest request
    );

    void deleteMessage(Long id);
}