package cricketbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "homepage_content")
public class HomepageContent {

    @Id
    private Integer id;

    @Column(name = "welcome_heading")
    private String welcomeHeading;

    @Column(name = "welcome_description", columnDefinition = "TEXT")
    private String welcomeDescription;

    @Column(name = "team_announcement", columnDefinition = "TEXT")
    private String teamAnnouncement;

    public HomepageContent() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getWelcomeHeading() {
        return welcomeHeading;
    }

    public void setWelcomeHeading(String welcomeHeading) {
        this.welcomeHeading = welcomeHeading;
    }

    public String getWelcomeDescription() {
        return welcomeDescription;
    }

    public void setWelcomeDescription(String welcomeDescription) {
        this.welcomeDescription = welcomeDescription;
    }

    public String getTeamAnnouncement() {
        return teamAnnouncement;
    }

    public void setTeamAnnouncement(String teamAnnouncement) {
        this.teamAnnouncement = teamAnnouncement;
    }
}