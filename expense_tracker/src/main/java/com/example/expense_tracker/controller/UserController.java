package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.categoryDto.CategoryRequestDto;
import com.example.expense_tracker.dto.categoryDto.CategoryResponseDto;
import com.example.expense_tracker.dto.userDto.UserRequestDto;
import com.example.expense_tracker.dto.userDto.UserResponseDto;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
private  UserService userService;
    @PostMapping
    public UserResponseDto adduser(@RequestBody UserRequestDto userRequestDto)
    {
        return userService.adduser(userRequestDto);
    }
    @GetMapping
    public List<UserResponseDto> getuser()
    {
        return userService.getuser();
    }

    @GetMapping("{id}")
    public UserResponseDto getuserbyid(@PathVariable Long id)
    {
        return userService.getuserbyid(id);
    }
    @PutMapping("{id}")
    public UserResponseDto updateuser(@PathVariable Long id, @RequestBody UserRequestDto userRequestDto)
    {
        return userService.updateuser(id,userRequestDto);
    }

    @DeleteMapping("{id}")
    public void deleteuser(@PathVariable Long id)
    {
        userService.deleteuser(id);
    }

}
