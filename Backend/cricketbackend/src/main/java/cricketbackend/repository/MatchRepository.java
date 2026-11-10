
package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.Match;

public interface MatchRepository
        extends JpaRepository<Match, Integer> {

}