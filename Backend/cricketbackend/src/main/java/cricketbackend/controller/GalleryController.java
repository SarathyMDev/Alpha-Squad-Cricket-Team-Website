
package cricketbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import cricketbackend.entity.Gallery;
import cricketbackend.repository.GalleryRepository;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryController {

    private final GalleryRepository galleryRepository;

    public GalleryController(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @GetMapping
    public List<Gallery> getAllGallery() {
        return galleryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gallery> getGalleryById(
            @PathVariable Integer id) {

        return galleryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Gallery addGallery(@RequestBody Gallery gallery) {
        return galleryRepository.save(gallery);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gallery> updateGallery(
            @PathVariable Integer id,
            @RequestBody Gallery updatedGallery) {

        return galleryRepository.findById(id)
                .map(gallery -> {
                    gallery.setTitle(updatedGallery.getTitle());
                    gallery.setDescription(updatedGallery.getDescription());
                    gallery.setImageUrl(updatedGallery.getImageUrl());

                    return ResponseEntity.ok(
                            galleryRepository.save(gallery));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGallery(
            @PathVariable Integer id) {

        if (!galleryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        galleryRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
