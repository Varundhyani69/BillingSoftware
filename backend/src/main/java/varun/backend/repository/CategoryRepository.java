package varun.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import varun.backend.entity.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

}
