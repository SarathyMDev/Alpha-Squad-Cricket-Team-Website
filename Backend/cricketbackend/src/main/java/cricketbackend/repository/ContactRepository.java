package cricketbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cricketbackend.entity.ContactMessage;

public interface ContactRepository
        extends JpaRepository<ContactMessage, Integer> {

}