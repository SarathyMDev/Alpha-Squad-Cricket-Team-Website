
package cricketbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import cricketbackend.entity.Player;
import cricketbackend.repository.PlayerRepository;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    // Get all players
    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    // Get player by ID
    @GetMapping("/{id}")
    public Player getPlayerById(@PathVariable Integer id) {
        return playerRepository.findById(id).orElse(null);
    }

    // Add a new player
    @PostMapping
    public Player addPlayer(@RequestBody Player player) {
        return playerRepository.save(player);
    }

    // Update a player
    @PutMapping("/{id}")
    public Player updatePlayer(
            @PathVariable Integer id,
            @RequestBody Player updatedPlayer) {

        return playerRepository.findById(id)
                .map(player -> {

                    player.setName(updatedPlayer.getName());
                    player.setRole(updatedPlayer.getRole());
                    player.setJerseyNumber(updatedPlayer.getJerseyNumber());
                    player.setBattingStyle(updatedPlayer.getBattingStyle());
                    player.setBowlingStyle(updatedPlayer.getBowlingStyle());

                    // Update profile photo if a new one is provided
                    if (updatedPlayer.getImageUrl() != null
                            && !updatedPlayer.getImageUrl().isBlank()) {

                        player.setImageUrl(updatedPlayer.getImageUrl());
                    }

                    return playerRepository.save(player);

                })
                .orElse(null);
    }

    // Delete a player
    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable Integer id) {
        playerRepository.deleteById(id);
    }
}
