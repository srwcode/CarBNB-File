package com.project.carbnb.service.impl;

import com.project.carbnb.dto.UserDto;
import com.project.carbnb.entity.File;
import com.project.carbnb.entity.User;
import com.project.carbnb.repository.FileRepository;
import com.project.carbnb.repository.UserRepository;
import com.project.carbnb.service.UserService;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private FileRepository fileRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, FileRepository fileRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileRepository = fileRepository;
    }

    @Override
    public List<UserDto> findAll() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return users.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public List<UserDto> findStatus() {
        List<User> users = userRepository.findByStatusIn(Arrays.asList((short) 1, (short) 2), Sort.by(Sort.Direction.DESC, "createdAt"));
        return users.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Override
    public UserDto findById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return convertEntityToDto(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public void storeData(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setStatus(userDto.getStatus());
        user.setRole(userDto.getRole());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setImageId(userDto.getImageId());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setBalance(userDto.getBalance());
        userRepository.save(user);
    }

    @Override
    public void updateData(UserDto currentUser, UserDto userDto) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setStatus(userDto.getStatus());
        user.setRole(userDto.getRole());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setBalance(userDto.getBalance());

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        if (userDto.getImageId() != null) {
            user.setImageId(userDto.getImageId());
        } else if (userDto.getImageRemove() != null && userDto.getImageRemove() == 1) {
            user.setImageId(null);
        }

        userRepository.save(user);
    }

    @Override
    public void removeData(UserDto currentUser) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus((short) 3);
        userRepository.save(user);
    }

    @Override
    public User userAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email);
        }

        return null;
    }

    @Override
    public void saveUser(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setStatus(userDto.getStatus());
        user.setRole(userDto.getRole());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        userRepository.save(user);
    }

    private UserDto convertEntityToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.setStatus(user.getStatus());
        userDto.setRole(user.getRole());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setImageId(user.getImageId());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setBalance(user.getBalance());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());

        if (user.getImageId() != null) {
            File file = fileRepository.findById(user.getImageId()).orElseThrow(() -> new RuntimeException("File not found"));

            if (file != null) {
                userDto.setImagePath(file.getPath());
            }
        }

        return userDto;
    }
}