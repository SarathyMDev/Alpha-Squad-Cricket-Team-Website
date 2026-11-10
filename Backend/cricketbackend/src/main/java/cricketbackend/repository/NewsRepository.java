package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.News;

public interface NewsRepository extends JpaRepository<News, Integer> {

}