package com.showroom.showroom_backend.service.impl;

import com.showroom.showroom_backend.dto.contact.ContactMessageRequest;
import com.showroom.showroom_backend.dto.contact.ContactMessageResponse;
import com.showroom.showroom_backend.entity.ContactMessage;
import com.showroom.showroom_backend.exception.ResourceNotFoundException;
import com.showroom.showroom_backend.repository.ContactMessageRepository;
import com.showroom.showroom_backend.service.ContactMessageService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactMessageServiceImpl
        implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageServiceImpl(
            ContactMessageRepository contactMessageRepository) {

        this.contactMessageRepository = contactMessageRepository;
    }

    @Override
    public ContactMessageResponse createMessage(
            ContactMessageRequest request) {

        ContactMessage message = new ContactMessage();

        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());

        // New contact message always starts as NEW
        message.setStatus("NEW");

        ContactMessage savedMessage =
                contactMessageRepository.save(message);

        return mapToResponse(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessageResponse> getAllMessages() {

        return contactMessageRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageResponse getMessageById(Long id) {

        ContactMessage message =
                contactMessageRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contact message not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessageResponse> getMessagesByStatus(
            String status) {

        return contactMessageRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ContactMessageResponse updateMessage(
            Long id,
            ContactMessageRequest request) {

        ContactMessage message =
                contactMessageRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contact message not found with id: "
                                                + id
                                )
                        );

        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setPhone(request.getPhone());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());

        ContactMessage updatedMessage =
                contactMessageRepository.save(message);

        return mapToResponse(updatedMessage);
    }

    @Override
    public void deleteMessage(Long id) {

        ContactMessage message =
                contactMessageRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contact message not found with id: "
                                                + id
                                )
                        );

        contactMessageRepository.delete(message);
    }

    private ContactMessageResponse mapToResponse(
            ContactMessage message) {

        return new ContactMessageResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getPhone(),
                message.getSubject(),
                message.getMessage(),
                message.getStatus(),
                message.getCreatedAt(),
                message.getUpdatedAt()
        );
    }
}