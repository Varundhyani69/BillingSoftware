package varun.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import varun.backend.entity.OrderEntity;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByOrderId(String orderId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.gradTotal) FROM OrderEntity o WHERE DATE(o.createdAt)=:date")
    Double sumSalesByDate(@Param("date")LocalDate date);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt)=:date")
    Long countByOrderDate(@Param("date") LocalDate date);

    @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
    List<OrderEntity> findRecentOrders(Pageable pageable);


}
