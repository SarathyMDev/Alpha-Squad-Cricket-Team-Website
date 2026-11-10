
package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cricketbackend.entity.Player;

public interface PlayerRepository
        extends JpaRepository<Player, Integer> {

}