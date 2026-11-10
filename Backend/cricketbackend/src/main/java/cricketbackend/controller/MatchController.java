
package cricketbackend.controller;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cricketbackend.entity.Match;
import cricketbackend.repository.MatchRepository;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchRepository matchRepository;

    public MatchController(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    // UPDATE MATCH
    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(
            @PathVariable Integer id,
            @RequestBody Match updatedMatch) {

        return matchRepository.findById(id)
                .map(match -> {
                    match.setOpponent(updatedMatch.getOpponent());
                    match.setMatchDate(updatedMatch.getMatchDate());
                    match.setMatchTime(updatedMatch.getMatchTime());
                    match.setVenue(updatedMatch.getVenue());
                    match.setOurScore(updatedMatch.getOurScore());
                    match.setOpponentScore(updatedMatch.getOpponentScore());
                    match.setResult(updatedMatch.getResult());
                    match.setStatus(updatedMatch.getStatus());

                    Match savedMatch = matchRepository.save(match);

                    return ResponseEntity.ok(savedMatch);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE MATCH
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Integer id) {

        if (!matchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        matchRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // GET ALL MATCHES
    @GetMapping
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    // GET MATCH BY ID
    @GetMapping("/{id}")
    public Match getMatchById(@PathVariable Integer id) {
        return matchRepository.findById(id).orElse(null);
    }

    // ADD MATCH
    @PostMapping
    public Match addMatch(@RequestBody Match match) {
        return matchRepository.save(match);
    }

    // HOMEPAGE MATCH STATISTICS
    @GetMapping("/statistics")
    public Map<String, Long> getMatchStatistics() {

        List<Match> matches = matchRepository.findAll();

        long matchesPlayed = matches.stream()
                .filter(match -> match.getStatus() != null
                        && match.getStatus().equalsIgnoreCase("Completed"))
                .count();

        long matchesWon = matches.stream()
                .filter(match -> match.getStatus() != null
                        && match.getStatus().equalsIgnoreCase("Completed"))
                .filter(match -> match.getResult() != null
                        && match.getResult().trim().toLowerCase().startsWith("won"))
                .count();

        long matchesLost = matches.stream()
                .filter(match -> match.getStatus() != null
                        && match.getStatus().equalsIgnoreCase("Completed"))
                .filter(match -> match.getResult() != null
                        && match.getResult().trim().toLowerCase().startsWith("lost"))
                .count();

        long matchesDrawn = matches.stream()
                .filter(match -> match.getStatus() != null
                        && match.getStatus().equalsIgnoreCase("Completed"))
                .filter(match -> match.getResult() != null
                        && match.getResult().trim().toLowerCase().startsWith("draw"))
                .count();

        Map<String, Long> statistics = new LinkedHashMap<>();

        statistics.put("matchesPlayed", matchesPlayed);
        statistics.put("matchesWon", matchesWon);
        statistics.put("matchesLost", matchesLost);
        statistics.put("matchesDrawn", matchesDrawn);

        return statistics;
    }
}
