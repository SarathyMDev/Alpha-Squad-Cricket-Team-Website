package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cricketbackend.entity.HomepageContent;

public interface HomepageContentRepository
        extends JpaRepository<HomepageContent, Integer> {
}