
package cricketbackend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import cricketbackend.entity.ContactMessage;
import cricketbackend.repository.ContactRepository;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @PostMapping
    public ResponseEntity<ContactMessage> saveMessage(
            @Valid @RequestBody ContactMessage contactMessage) {

        ContactMessage savedMessage =
                contactRepository.save(contactMessage);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedMessage);
    }
}
