
package cricketbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cricketbackend.entity.HomepageStatistics;
import cricketbackend.repository.HomepageStatisticsRepository;

@RestController
@RequestMapping("/api/homepage-statistics")
@CrossOrigin(origins = "*")
public class HomepageStatisticsController {

    private final HomepageStatisticsRepository statisticsRepository;

    public HomepageStatisticsController(
            HomepageStatisticsRepository statisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    // GET TROPHY COUNT
    @GetMapping
    public ResponseEntity<HomepageStatistics> getStatistics() {

        return statisticsRepository.findById(1)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE TROPHY COUNT
    @PutMapping
    public ResponseEntity<HomepageStatistics> updateStatistics(
            @RequestBody HomepageStatistics updatedStatistics) {

        if (updatedStatistics.getTrophiesWon() == null
                || updatedStatistics.getTrophiesWon() < 0) {
            return ResponseEntity.badRequest().build();
        }

        HomepageStatistics statistics = statisticsRepository.findById(1)
                .orElse(new HomepageStatistics());

        statistics.setId(1);
        statistics.setTrophiesWon(updatedStatistics.getTrophiesWon());

        return ResponseEntity.ok(
                statisticsRepository.save(statistics));
    }
}
