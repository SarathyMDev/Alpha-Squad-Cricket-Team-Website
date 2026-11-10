
package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.Gallery;

public interface GalleryRepository
        extends JpaRepository<Gallery, Integer> {
}
