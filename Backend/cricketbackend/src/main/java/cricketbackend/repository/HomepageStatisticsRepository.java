
package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.HomepageStatistics;

public interface HomepageStatisticsRepository
        extends JpaRepository<HomepageStatistics, Integer> {
}
