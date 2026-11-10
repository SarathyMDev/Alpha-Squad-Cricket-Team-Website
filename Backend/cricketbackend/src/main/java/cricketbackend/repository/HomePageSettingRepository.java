package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.HomePageSetting;

public interface HomePageSettingRepository
        extends JpaRepository<HomePageSetting, Integer> {
}