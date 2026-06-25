package varun.backend.controller;

import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import varun.backend.io.OrderResponse;
import varun.backend.io.PaymentRequest;
import varun.backend.io.PaymentVerificationRequest;
import varun.backend.io.RazorpayOrderResponse;
import varun.backend.service.OrderService;
import varun.backend.service.RazorpayService;

@RestController
@RequestMapping("payments")
@RequiredArgsConstructor
public class PaymentController {
    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        return razorpayService.createOrder(request.getAmount(),request.getCurrency());
    }
    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request){
        return orderService.verifyPayment(request);

    }
}
