package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.categoryDto.CategoryRequestDto;
import com.example.expense_tracker.dto.categoryDto.CategoryResponseDto;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.service.annotation.GetExchange;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @PostMapping
    public CategoryResponseDto addcategory(@RequestBody CategoryRequestDto categoryRequestDto)
    {
        return categoryService.addcategory(categoryRequestDto);
    }

    @GetMapping
    public List<CategoryResponseDto> getallcategory()
    {
        return categoryService.getallcategory();
    }

    @GetMapping("{id}")
    public CategoryResponseDto getcategorybyid(@PathVariable Long id)
    {
        return categoryService.getcategorybyid(id);
    }
    @PutMapping("{id}")
    public CategoryResponseDto updatecategory(@PathVariable Long id, @RequestBody CategoryRequestDto categoryRequestDto)
    {
        return categoryService.updatecategory(id,categoryRequestDto);
    }

    @DeleteMapping("{id}")
    public void deletecategory(@PathVariable Long id)
    {
        categoryService.deletecategory(id);
    }

}
