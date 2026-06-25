package varun.backend.service;

import varun.backend.io.OrderRequest;
import varun.backend.io.OrderResponse;
import varun.backend.io.PaymentVerificationRequest;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    void deleteOrder(String orderId);
    List<OrderResponse> getLatestOrder();

    OrderResponse verifyPayment(PaymentVerificationRequest request);
}
