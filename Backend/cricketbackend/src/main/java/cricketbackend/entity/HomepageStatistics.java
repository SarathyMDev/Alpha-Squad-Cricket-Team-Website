
package cricketbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "homepage_statistics")
public class HomepageStatistics {

    @Id
    private Integer id;

    @Column(name = "trophies_won")
    private Integer trophiesWon;

    public HomepageStatistics() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTrophiesWon() {
        return trophiesWon;
    }

    public void setTrophiesWon(Integer trophiesWon) {
        this.trophiesWon = trophiesWon;
    }
}
