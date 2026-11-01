package com.example.expense_tracker.service;


import com.example.expense_tracker.dto.categoryDto.CategoryRequestDto;
import com.example.expense_tracker.dto.categoryDto.CategoryResponseDto;
import com.example.expense_tracker.dto.userDto.UserRequestDto;
import com.example.expense_tracker.dto.userDto.UserResponseDto;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
public UserResponseDto adduser(UserRequestDto userRequestDto)
{
    User user = new User();
    user.setName(userRequestDto.getName());
     User userresponse =userRepository.save(user);
     UserResponseDto userResponseDto =new UserResponseDto();
     userResponseDto.setId(userresponse.getId());
    userResponseDto.setName(userresponse.getName());
    return userResponseDto;
}

public List<UserResponseDto> getuser()
{
    return userRepository.findAll()
            .stream()
            .map(user -> {
                UserResponseDto dto = new UserResponseDto();
                dto.setId(user.getId());
                dto.setName(user.getName());
                return dto;
            })
            .toList();
}


    public UserResponseDto getuserbyid(Long id)
    {
        User user= userRepository.getById(id);
        UserResponseDto userResponseDto=new UserResponseDto();
        userResponseDto.setId( user.getId());
        userResponseDto.setName(user.getName());
        return userResponseDto;
    }

    public UserResponseDto updateuser(Long id, UserRequestDto userRequestDto)
    {
        User user= new User();
        user=userRepository.findById(id).orElseThrow(()-> new RuntimeException(" user not found"));
        user.setName(userRequestDto.getName());
        User userresponse =userRepository.save(user);
        UserResponseDto userResponseDto=new UserResponseDto();
        userResponseDto.setId(userresponse.getId());
        userResponseDto.setName(userresponse.getName());

        return userResponseDto;
    }

    public void deleteuser(Long id) {
        userRepository.deleteById(id);

    }

}
