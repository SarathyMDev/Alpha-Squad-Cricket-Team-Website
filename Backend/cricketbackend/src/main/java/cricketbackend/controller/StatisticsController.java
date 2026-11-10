
package cricketbackend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cricketbackend.entity.PlayerStatistics;
import cricketbackend.repository.StatisticsRepository;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsRepository statisticsRepository;

    public StatisticsController(StatisticsRepository statisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    // Get all statistics
    @GetMapping
    public List<PlayerStatistics> getAllStatistics() {
        return statisticsRepository.findAll();
    }

    // Get statistics by ID
    @GetMapping("/{id}")
    public ResponseEntity<PlayerStatistics> getStatisticsById(
            @PathVariable Integer id) {

        return statisticsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add new statistics
    @PostMapping
    public PlayerStatistics addStatistics(
            @RequestBody PlayerStatistics statistics) {

        return statisticsRepository.save(statistics);
    }

    // Update statistics
    @PutMapping("/{id}")
    public ResponseEntity<PlayerStatistics> updateStatistics(
            @PathVariable Integer id,
            @RequestBody PlayerStatistics updatedStatistics) {

        return statisticsRepository.findById(id)
                .map(existing -> {

                    existing.setPlayerId(updatedStatistics.getPlayerId());
                    existing.setMatchesPlayed(updatedStatistics.getMatchesPlayed());
                    existing.setRuns(updatedStatistics.getRuns());
                    existing.setBattingAverage(updatedStatistics.getBattingAverage());
                    existing.setHighestScore(updatedStatistics.getHighestScore());
                    existing.setWickets(updatedStatistics.getWickets());
                    existing.setEconomy(updatedStatistics.getEconomy());
                    existing.setBestBowling(updatedStatistics.getBestBowling());

                    PlayerStatistics saved =
                            statisticsRepository.save(existing);

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete statistics
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatistics(
            @PathVariable Integer id) {

        if (!statisticsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        statisticsRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
