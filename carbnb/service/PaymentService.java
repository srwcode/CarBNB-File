package com.project.carbnb.service;

import com.project.carbnb.dto.PaymentDto;
import java.util.List;

public interface PaymentService {
    List<PaymentDto> findAll();
    List<PaymentDto> findStatus();
    List<PaymentDto> findByUserId(Long id);
    PaymentDto findById(Long id);
    PaymentDto findByIdAndUserId(Long id, Long userId);
    void storeData(PaymentDto paymentDto);
    void updateData(PaymentDto payment, PaymentDto paymentDto);
    void removeData(PaymentDto payment);
}
