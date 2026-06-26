package varun.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import varun.backend.io.DashboardResponse;
import varun.backend.io.OrderResponse;
import varun.backend.service.OrderService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    final OrderService orderService;
    @GetMapping
    public DashboardResponse getDashboardData(){
        LocalDate today = LocalDate.now();
        Double todaySale = orderService.sumSalesByDate(today);
        Long todayOrderCount = orderService.countByOrderDate(today);;
        List<OrderResponse> recentOrders = orderService.findRecentOrders();
        return new DashboardResponse(
                todaySale!=null?todaySale:0.0,
                todayOrderCount!=null?todayOrderCount:0,
                recentOrders
        );

    }

}
