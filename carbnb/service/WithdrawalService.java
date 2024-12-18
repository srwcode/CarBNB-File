package com.project.carbnb.service;

import com.project.carbnb.dto.WithdrawalDto;
import java.util.List;

public interface WithdrawalService {
    List<WithdrawalDto> findAll();
    List<WithdrawalDto> findStatus();
    List<WithdrawalDto> findByUserId(Long id);
    WithdrawalDto findById(Long id);
    WithdrawalDto findByIdAndUserId(Long id, Long userId);
    void storeData(WithdrawalDto withdrawalDto);
    void updateData(WithdrawalDto withdrawal, WithdrawalDto withdrawalDto);
    void removeData(WithdrawalDto withdrawal);
}
