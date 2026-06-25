package varun.backend.service;

import com.razorpay.RazorpayException;
import varun.backend.io.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
