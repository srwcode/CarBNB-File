package com.project.carbnb.controller.member;

import com.project.carbnb.dto.PaymentDto;
import com.project.carbnb.entity.Reservation;
import com.project.carbnb.entity.Schedule;
import com.project.carbnb.service.ReservationService;
import com.project.carbnb.service.UserService;
import com.project.carbnb.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("member/payments")
public class MemberPaymentController {

    private PaymentService paymentService;
    private UserService userService;
    private ReservationService reservationService;

    public MemberPaymentController(PaymentService paymentService, UserService userService, ReservationService reservationService) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.reservationService = reservationService;
    }

    @PostMapping("/index")
    public List<PaymentDto> index() {
        return paymentService.findByUserId(userService.userAuth().getId());
    }

    @PostMapping("/store/{id}")
    public ResponseEntity<Boolean> store(
        @PathVariable Long id,
        @RequestPart("payment") PaymentDto paymentDto
    ) {
        boolean created = false;

        if(paymentDto.getAmount() != null && paymentDto.getAmount().compareTo(BigDecimal.ZERO) > 0 &&
            paymentDto.getMethod() != null
        ) {
            paymentDto.setUser(userService.userAuth());
            paymentDto.setStatus((short) 1);

            Reservation reservation = reservationService.findByReservationId(id);
            paymentDto.setReservation(reservation);

            paymentService.storeData(paymentDto);
            created = true;
        }

        return ResponseEntity.ok(created);
    }
}