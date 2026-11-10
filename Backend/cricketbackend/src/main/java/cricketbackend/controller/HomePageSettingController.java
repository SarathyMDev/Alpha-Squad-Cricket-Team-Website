package cricketbackend.controller;

import org.springframework.web.bind.annotation.*;

import cricketbackend.entity.HomePageSetting;
import cricketbackend.repository.HomePageSettingRepository;

@RestController
@RequestMapping("/api/home-settings")
@CrossOrigin(origins = "*")
public class HomePageSettingController {

    private final HomePageSettingRepository repository;

    public HomePageSettingController(HomePageSettingRepository repository) {
        this.repository = repository;
    }

    // Get homepage background image
    @GetMapping
    public HomePageSetting getHomePageSettings() {
        return repository.findById(1)
                .orElseThrow(() ->
                    new RuntimeException("Homepage settings not found"));
    }

    // Update homepage background image
    @PutMapping
    public HomePageSetting updateHomePageSettings(
            @RequestBody HomePageSetting settings) {

        HomePageSetting existing = repository.findById(1)
                .orElseThrow(() ->
                    new RuntimeException("Homepage settings not found"));

        existing.setBackgroundImageUrl(
                settings.getBackgroundImageUrl());

        return repository.save(existing);
    }
}