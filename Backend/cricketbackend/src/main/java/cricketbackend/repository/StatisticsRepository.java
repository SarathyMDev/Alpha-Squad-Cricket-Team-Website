package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.PlayerStatistics;

public interface StatisticsRepository
        extends JpaRepository<PlayerStatistics, Integer> {

}