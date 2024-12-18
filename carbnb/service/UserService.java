package com.project.carbnb.service;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.entity.User;
import java.util.List;

public interface UserService {
    List<UserDto> findAll();
    List<UserDto> findStatus();
    User findByEmail(String email);
    User findByUsername(String username);
    UserDto findById(Long id);
    void saveUser(UserDto userDto);
    void storeData(UserDto userDto);
    void updateData(UserDto user, UserDto userDto);
    void removeData(UserDto user);
    User userAuth();
}
