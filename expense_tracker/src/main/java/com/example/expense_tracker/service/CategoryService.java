package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.categoryDto.CategoryRequestDto;
import com.example.expense_tracker.dto.categoryDto.CategoryResponseDto;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
@Autowired
    private CategoryRepository categoryRepository;


public CategoryResponseDto addcategory(CategoryRequestDto categoryRequestDto)
 {
     Category category=new Category();
     category.setName(categoryRequestDto.getName());
     Category categoryresponse = categoryRepository.save(category);
     CategoryResponseDto categoryResponseDto =new CategoryResponseDto();
     categoryResponseDto.setId(categoryresponse.getCategory_id());
     categoryResponseDto.setName(categoryresponse.getName());
     return categoryResponseDto;
 }

 public List<CategoryResponseDto> getallcategory()
 {

     return categoryRepository.findAll()
             .stream()
             .map(category -> {
                 CategoryResponseDto dto = new CategoryResponseDto();
                 dto.setId(category.getCategory_id());
                 dto.setName(category.getName());
                 return dto;
             })
             .toList();
 }

 public CategoryResponseDto getcategorybyid(Long id)
 {
    Category category= categoryRepository.getById(id);
     CategoryResponseDto categoryResponseDto=new CategoryResponseDto();
     categoryResponseDto.setId(category.getCategory_id());
     categoryResponseDto.setName(category.getName());
     return categoryResponseDto;
 }

 public CategoryResponseDto updatecategory(Long id, CategoryRequestDto categoryRequestDto)
 {
     Category category= new Category();
     category=categoryRepository.findById(id).orElseThrow(()-> new RuntimeException(" category not found"));
     category.setName(categoryRequestDto.getName());
     Category categoryresponse =categoryRepository.save(category);
     CategoryResponseDto categoryResponseDto=new CategoryResponseDto();
     categoryResponseDto.setId(categoryresponse.getCategory_id());
     categoryResponseDto.setName(categoryresponse.getName());

return categoryResponseDto;
 }

 public void deletecategory(Long id) {
       categoryRepository.deleteById(id);

 }



}
