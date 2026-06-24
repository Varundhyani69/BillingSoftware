package varun.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import varun.backend.entity.OrderEntity;

import java.util.List;
import java.util.Optional;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByOrderId(String orderId);
    List<OrderEntity> findAllByOrderByCreatedAtDesc();
}
