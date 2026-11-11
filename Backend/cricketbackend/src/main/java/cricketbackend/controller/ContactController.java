
package cricketbackend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import cricketbackend.entity.ContactMessage;
import cricketbackend.repository.ContactRepository;

@RestController
@RequestMapping("/api/contact")

public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // Save customer message
    @PostMapping
    public ResponseEntity<ContactMessage> saveMessage(
            @Valid @RequestBody ContactMessage contactMessage) {

        ContactMessage savedMessage =
                contactRepository.save(contactMessage);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedMessage);
    }

    // Admin: View all messages
    @GetMapping
    public List<ContactMessage> getAllMessages() {
        return contactRepository.findAll();
    }

    // Admin: Mark message as read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {

        Optional<ContactMessage> optionalMessage =
                contactRepository.findById(id);

        if (optionalMessage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ContactMessage message = optionalMessage.get();
        message.setRead(true);

        return ResponseEntity.ok(contactRepository.save(message));
    }

    // Admin: Delete message
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Integer id) {

        if (!contactRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        contactRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Contact message deleted successfully")
        );
    }
}
