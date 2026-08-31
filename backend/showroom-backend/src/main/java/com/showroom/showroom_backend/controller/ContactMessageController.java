package com.showroom.showroom_backend.controller;

import com.showroom.showroom_backend.dto.contact.ContactMessageRequest;
import com.showroom.showroom_backend.dto.contact.ContactMessageResponse;
import com.showroom.showroom_backend.service.ContactMessageService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(
            ContactMessageService contactMessageService) {

        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    public ResponseEntity<ContactMessageResponse> createMessage(
            @Valid @RequestBody ContactMessageRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contactMessageService.createMessage(request));
    }

    @GetMapping
    public ResponseEntity<List<ContactMessageResponse>> getAllMessages() {

        return ResponseEntity.ok(
                contactMessageService.getAllMessages()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessageResponse> getMessageById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                contactMessageService.getMessageById(id)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ContactMessageResponse>> getMessagesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                contactMessageService.getMessagesByStatus(status)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactMessageResponse> updateMessage(
            @PathVariable Long id,
            @Valid @RequestBody ContactMessageRequest request) {

        return ResponseEntity.ok(
                contactMessageService.updateMessage(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long id) {

        contactMessageService.deleteMessage(id);

        return ResponseEntity.noContent().build();
    }
}