package com.project.carbnb.service.impl;

import com.project.carbnb.dto.WithdrawalDto;
import com.project.carbnb.entity.User;
import com.project.carbnb.entity.Withdrawal;
import com.project.carbnb.repository.UserRepository;
import com.project.carbnb.repository.WithdrawalRepository;
import com.project.carbnb.service.WithdrawalService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WithdrawalServiceImpl implements WithdrawalService {

    private WithdrawalRepository withdrawalRepository;
    private UserRepository userRepository;

    public WithdrawalServiceImpl(WithdrawalRepository withdrawalRepository, UserRepository userRepository) {
        this.withdrawalRepository = withdrawalRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<WithdrawalDto> findAll() {
        List<Withdrawal> withdrawals = withdrawalRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return withdrawals.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<WithdrawalDto> findStatus() {
        List<Withdrawal> withdrawals = withdrawalRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return withdrawals.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<WithdrawalDto> findByUserId(Long id) {
        List<Withdrawal> withdrawals = withdrawalRepository.findByUserIdAndStatusIn(id, Arrays.asList((short) 1, (short) 2, (short) 3), Sort.by(Sort.Direction.DESC, "createdAt"));
        return withdrawals.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public WithdrawalDto findById(Long id) {
        Withdrawal withdrawal = withdrawalRepository.findById(id).orElseThrow(() -> new RuntimeException("Withdrawal not found"));
        return convertEntityToDto(withdrawal);
    }

    @Override
    public WithdrawalDto findByIdAndUserId(Long id, Long userId) {
        Withdrawal withdrawal = withdrawalRepository.findByIdAndUserIdAndStatusIn(id, userId, Arrays.asList((short) 1, (short) 2, (short) 3)).orElseThrow(() -> new RuntimeException("Withdrawal not found"));
        return convertEntityToDto(withdrawal);
    }

    @Override
    public void storeData(WithdrawalDto withdrawalDto) {
        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setId(withdrawalDto.getId());
        withdrawal.setUser(withdrawalDto.getUser());
        withdrawal.setStatus(withdrawalDto.getStatus());
        withdrawal.setAmount(withdrawalDto.getAmount());
        withdrawal.setMethod(withdrawalDto.getMethod());
        withdrawal.setAccount(withdrawalDto.getAccount());

        BigDecimal withdrawalAmount = withdrawalDto.getAmount();
        BigDecimal currentBalance = withdrawal.getUser().getBalance();

        if (currentBalance.compareTo(withdrawalAmount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        BigDecimal newBalance = currentBalance.subtract(withdrawalAmount);

        User user = userRepository.findById(withdrawal.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBalance(newBalance);
        userRepository.save(user);

        withdrawalRepository.save(withdrawal);
    }

    @Override
    public void updateData(WithdrawalDto currentWithdrawal, WithdrawalDto withdrawalDto) {
        Withdrawal withdrawal = withdrawalRepository.findById(currentWithdrawal.getId()).orElseThrow(() -> new RuntimeException("Withdrawal not found"));
        withdrawal.setUser(withdrawalDto.getUser());
        withdrawal.setStatus(withdrawalDto.getStatus());
        withdrawal.setAmount(withdrawalDto.getAmount());
        withdrawal.setMethod(withdrawalDto.getMethod());
        withdrawal.setAccount(withdrawalDto.getAccount());
        withdrawalRepository.save(withdrawal);
    }

    @Override
    public void removeData(WithdrawalDto currentWithdrawal) {
        Withdrawal withdrawal = withdrawalRepository.findById(currentWithdrawal.getId()).orElseThrow(() -> new RuntimeException("Withdrawal not found"));
        withdrawal.setStatus((short) 4);
        withdrawalRepository.save(withdrawal);
    }

    private WithdrawalDto convertEntityToDto(Withdrawal withdrawal) {
        WithdrawalDto withdrawalDto = new WithdrawalDto();
        withdrawalDto.setId(withdrawal.getId());
        withdrawalDto.setUser(withdrawal.getUser());
        withdrawalDto.setStatus(withdrawal.getStatus());
        withdrawalDto.setAmount(withdrawal.getAmount());
        withdrawalDto.setMethod(withdrawal.getMethod());
        withdrawalDto.setAccount(withdrawal.getAccount());
        withdrawalDto.setCreatedAt(withdrawal.getCreatedAt());
        withdrawalDto.setUpdatedAt(withdrawal.getUpdatedAt());
        return withdrawalDto;
    }
}