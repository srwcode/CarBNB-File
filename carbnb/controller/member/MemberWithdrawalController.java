package com.project.carbnb.controller.member;

import com.project.carbnb.dto.WithdrawalDto;
import com.project.carbnb.service.WithdrawalService;
import com.project.carbnb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("member/withdrawals")
public class MemberWithdrawalController {

    private WithdrawalService withdrawalService;
    private UserService userService;

    public MemberWithdrawalController(WithdrawalService withdrawalService, UserService userService) {
        this.withdrawalService = withdrawalService;
        this.userService = userService;
    }

    @PostMapping("/index")
    public List<WithdrawalDto> index() {
        return withdrawalService.findByUserId(userService.userAuth().getId());
    }

    @PostMapping("/store")
    public ResponseEntity<Boolean> store(
            @RequestPart("withdrawal") WithdrawalDto withdrawalDto
    ) {
        boolean created = false;

        if(withdrawalDto.getAmount() != null && withdrawalDto.getAmount().compareTo(BigDecimal.ZERO) > 0 &&
            withdrawalDto.getMethod() != null &&
            withdrawalDto.getAccount() != null
        ) {
            withdrawalDto.setUser(userService.userAuth());
            withdrawalDto.setStatus((short) 1);

            withdrawalService.storeData(withdrawalDto);
            created = true;
        }

        return ResponseEntity.ok(created);
    }
}