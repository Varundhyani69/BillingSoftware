package varun.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import varun.backend.io.PaymentDetails;
import varun.backend.io.PaymentMethod;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="tbl_order")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;
     private String orderId;
     private String customerId;
     private String phoneNumber;
     private Double subtotal;
     private Double tax;
     private Double gradTotal;
     private LocalDateTime createdAt;
     @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
     @JoinColumn(name = "order_id")
     private List<OrderItemEntity> items = new ArrayList<>();
    @Embedded
     private PaymentDetails paymentDetails;
    @Enumerated(EnumType.STRING)
     private PaymentMethod paymentMethod;
 @PrePersist
    protected void onCreate(){
     this.orderId = "ORD"+System.currentTimeMillis();
     this.createdAt = LocalDateTime.now();
 }

}
