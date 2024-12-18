package com.project.carbnb.service.impl;

import com.project.carbnb.dto.PaymentDto;
import com.project.carbnb.entity.Payment;
import com.project.carbnb.repository.PaymentRepository;
import com.project.carbnb.service.PaymentService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public List<PaymentDto> findAll() {
        List<Payment> payments = paymentRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return payments.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> findStatus() {
        List<Payment> payments = paymentRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return payments.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> findByUserId(Long id) {
        List<Payment> payments = paymentRepository.findByUserIdAndStatusIn(id, Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return payments.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public PaymentDto findById(Long id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertEntityToDto(payment);
    }

    @Override
    public PaymentDto findByIdAndUserId(Long id, Long userId) {
        Payment payment = paymentRepository.findByIdAndUserIdAndStatusIn(id, userId, Arrays.asList((short) 1, (short) 2, (short) 3)).orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertEntityToDto(payment);
    }

    @Override
    public void storeData(PaymentDto paymentDto) {
        Payment payment = new Payment();
        payment.setId(paymentDto.getId());
        payment.setUser(paymentDto.getUser());
        payment.setReservation(paymentDto.getReservation());
        payment.setStatus(paymentDto.getStatus());
        payment.setAmount(paymentDto.getAmount());
        payment.setMethod(paymentDto.getMethod());
        paymentRepository.save(payment);
    }

    @Override
    public void updateData(PaymentDto currentPayment, PaymentDto paymentDto) {
        Payment payment = paymentRepository.findById(currentPayment.getId()).orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setUser(paymentDto.getUser());
        payment.setReservation(paymentDto.getReservation());
        payment.setStatus(paymentDto.getStatus());
        payment.setAmount(paymentDto.getAmount());
        payment.setMethod(paymentDto.getMethod());
        paymentRepository.save(payment);
    }

    @Override
    public void removeData(PaymentDto currentPayment) {
        Payment payment = paymentRepository.findById(currentPayment.getId()).orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus((short) 4);
        paymentRepository.save(payment);
    }

    private PaymentDto convertEntityToDto(Payment payment) {
        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setUser(payment.getUser());
        paymentDto.setReservation(payment.getReservation());
        paymentDto.setStatus(payment.getStatus());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setMethod(payment.getMethod());
        paymentDto.setCreatedAt(payment.getCreatedAt());
        paymentDto.setUpdatedAt(payment.getUpdatedAt());
        return paymentDto;
    }
}