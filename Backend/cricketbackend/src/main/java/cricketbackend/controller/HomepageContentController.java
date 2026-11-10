package cricketbackend.controller;

import org.springframework.web.bind.annotation.*;

import cricketbackend.entity.HomepageContent;
import cricketbackend.repository.HomepageContentRepository;

@RestController
@RequestMapping("/api/homepage-content")
@CrossOrigin(origins = "*")
public class HomepageContentController {

    private final HomepageContentRepository repository;

    public HomepageContentController(HomepageContentRepository repository) {
        this.repository = repository;
    }

    // Get homepage content
    @GetMapping
    public HomepageContent getHomepageContent() {
        return repository.findById(1)
                .orElseThrow(() ->
                    new RuntimeException("Homepage content not found"));
    }

    // Update homepage content
    @PutMapping
    public HomepageContent updateHomepageContent(
            @RequestBody HomepageContent content) {

        HomepageContent existing = repository.findById(1)
                .orElseThrow(() ->
                    new RuntimeException("Homepage content not found"));

        existing.setWelcomeHeading(content.getWelcomeHeading());
        existing.setWelcomeDescription(content.getWelcomeDescription());
        existing.setTeamAnnouncement(content.getTeamAnnouncement());

        return repository.save(existing);
    }
}