package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.categoryDto.CategoryRequestDto;
import com.example.expense_tracker.dto.categoryDto.CategoryResponseDto;
import com.example.expense_tracker.dto.expenseDto.ExpenseRequestDto;
import com.example.expense_tracker.dto.expenseDto.ExpenseResponseDto;
import com.example.expense_tracker.entity.Expense;
import com.example.expense_tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;
    @PostMapping
    public ExpenseResponseDto addExpense(@RequestBody ExpenseRequestDto expenseRequestDto)
    {
        return expenseService.addExpense(expenseRequestDto);
    }
    @PostMapping("/debug2")
    public ExpenseRequestDto debug2(@RequestBody ExpenseRequestDto dto) {
        return dto;
    }
    @GetMapping
    public List<ExpenseResponseDto> getallexpense()
    {
        return expenseService.getallexpenses();
    }

    @GetMapping("{id}")
    public ExpenseResponseDto getexpensebyid(@PathVariable Long id)
    {
        return expenseService.getexpensebyid(id);
    }
    @PutMapping("{id}")
    public ExpenseResponseDto updateexpense(@PathVariable Long id, @RequestBody ExpenseRequestDto expenseRequestDto)
    {
        return expenseService.updateexpense(id,expenseRequestDto);
    }

    @DeleteMapping("{id}")
    public void deleteexpense(@PathVariable Long id)
    {
        expenseService.deleteexpense(id);
    }


}
