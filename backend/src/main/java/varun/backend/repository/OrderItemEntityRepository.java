package varun.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import varun.backend.entity.OrderItemEntity;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity, Long> {

}
