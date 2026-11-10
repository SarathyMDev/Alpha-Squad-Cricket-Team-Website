
package cricketbackend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "player_statistics")
public class PlayerStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stat_id")
    private Integer statId;

    @Column(name = "player_id")
    private Integer playerId;

    @Column(name = "matches_played")
    private Integer matchesPlayed;

    private Integer runs;

    @Column(name = "batting_average")
    private BigDecimal battingAverage;

    @Column(name = "highest_score")
    private Integer highestScore;

    private Integer wickets;

    private BigDecimal economy;

    @Column(name = "best_bowling")
    private String bestBowling;

    public PlayerStatistics() {}

    public Integer getStatId() {
        return statId;
    }

    public void setStatId(Integer statId) {
        this.statId = statId;
    }

    public Integer getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Integer playerId) {
        this.playerId = playerId;
    }

    public Integer getMatchesPlayed() {
        return matchesPlayed;
    }

    public void setMatchesPlayed(Integer matchesPlayed) {
        this.matchesPlayed = matchesPlayed;
    }

    public Integer getRuns() {
        return runs;
    }

    public void setRuns(Integer runs) {
        this.runs = runs;
    }

    public BigDecimal getBattingAverage() {
        return battingAverage;
    }

    public void setBattingAverage(BigDecimal battingAverage) {
        this.battingAverage = battingAverage;
    }

    public Integer getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(Integer highestScore) {
        this.highestScore = highestScore;
    }

    public Integer getWickets() {
        return wickets;
    }

    public void setWickets(Integer wickets) {
        this.wickets = wickets;
    }

    public BigDecimal getEconomy() {
        return economy;
    }

    public void setEconomy(BigDecimal economy) {
        this.economy = economy;
    }

    public String getBestBowling() {
        return bestBowling;
    }

    public void setBestBowling(String bestBowling) {
        this.bestBowling = bestBowling;
    }
}
