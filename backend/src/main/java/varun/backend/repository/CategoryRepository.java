package varun.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import varun.backend.entity.CategoryEntity;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findByCategoryId(String categoryId);
}
