
package cricketbackend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import cricketbackend.repository.PlayerRepository;

@RestController
@RequestMapping("/api/homepage-player-statistics")
@CrossOrigin(origins = "*")
public class HomepagePlayerStatisticsController {

    private final PlayerRepository playerRepository;

    public HomepagePlayerStatisticsController(
            PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping
    public Map<String, Long> getPlayerStatistics() {

        long totalPlayers = playerRepository.count();

        return Map.of("totalPlayers", totalPlayers);
    }
}
