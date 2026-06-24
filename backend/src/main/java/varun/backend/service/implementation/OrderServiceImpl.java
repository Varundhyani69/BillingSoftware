package varun.backend.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import varun.backend.entity.OrderEntity;
import varun.backend.entity.OrderItemEntity;
import varun.backend.io.OrderRequest;
import varun.backend.io.OrderResponse;
import varun.backend.io.PaymentDetails;
import varun.backend.io.PaymentMethod;
import varun.backend.repository.OrderEntityRepository;
import varun.backend.service.OrderService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderEntityRepository orderEntityRepository;
    @Override
    public OrderResponse createOrder(OrderRequest request) {
        OrderEntity newOrder = convertToOrderEntity(request);
        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setStaus(newOrder.getPaymentMethod() == PaymentMethod.CASH?
                PaymentDetails.PaymentStatus.COMPLETED : PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);
        List<OrderItemEntity> orderItems = request.getCartItems().stream()
                .map(this::convertToOrderEntity)
                .collect(Collectors.toList());
        newOrder.setItems(orderItems);
        newOrder = orderEntityRepository.save(newOrder);
        return convertToResponse(newOrder);

    }
    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest){
        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }
    private OrderResponse convertToResponse(OrderEntity newOrder) {
        OrderResponse.builder()
                .orderId(newOrder.getOrderId())
                .customerName(newOrder.getCustomerName())
                .phoneNumber(newOrder.getPhoneNumber())
                .subtotal(newOrder.getSubtotal())
                .tax(newOrder.getTax())
                .grandTotal(newOrder.getGradTotal())
                .paymentMethod(newOrder.getPaymentMethod())
                .items(newOrder.getItems().stream())
                .map(this::convertToItemResponse)
                .collect(Collectors.toList())
                .paymentDetails(newOrder.getPaymentDetails())
                .createdAt(newOrder.getCreatedAt())
                .build();

    }

    private OrderEntity convertToOrderEntity(OrderRequest request) {
        () -> OrderEntity.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .subtotal(request.getSubtotal())
                .tax(request.getTax())
                .grandTotal(request.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .build();
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity){
        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();
    }


    @Override
    public void deleteOrder(String orderId) {
        OrderEntity existingOrder =  orderEntityRepository.findByOrderId(orderId)
                .orElseThrow(()->new RuntimeException("Order not found"));
        orderEntityRepository.delete(existingOrder);
    }

    @Override
    public List<OrderResponse> getLatestOrder() {
        return orderEntityRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}
