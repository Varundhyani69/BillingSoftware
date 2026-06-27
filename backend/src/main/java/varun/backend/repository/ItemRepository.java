package varun.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import varun.backend.entity.ItemEntity;

public interface ItemRepository extends JpaRepository<ItemEntity, Long> {
    Optional<ItemEntity> findByItemId(String id);
    Integer countByCategory_CategoryId(String categoryId);
}
