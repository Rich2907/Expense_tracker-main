package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.categoryDto.CategoryRequestDto;
import com.example.expense_tracker.dto.categoryDto.CategoryResponseDto;
import com.example.expense_tracker.dto.expenseDto.ExpenseRequestDto;
import com.example.expense_tracker.dto.expenseDto.ExpenseResponseDto;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.Expense;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.repository.CategoryRepository;
import com.example.expense_tracker.repository.ExpenseRepository;
import com.example.expense_tracker.repository.UserRepository;
import org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
   public ExpenseResponseDto addExpense(ExpenseRequestDto dto)
    {
        Expense expense = new Expense();

        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        System.out.println("User ID = " + dto.getUserid());
        System.out.println("Category ID = " + dto.getCategoryid());

        User user = userRepository.findById(dto.getUserid())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(dto.getCategoryid())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        expense.setUser(user);
        expense.setCategory(category);

        Expense expenseresponse=expenseRepository.save(expense);
        ExpenseResponseDto expenseResponseDto=new ExpenseResponseDto();
   expenseResponseDto.setId(expenseresponse.getId());
        expenseResponseDto.setAmount(expenseresponse.getAmount());
        expenseResponseDto.setDescription(expenseresponse.getDescription());
        expenseResponseDto.setUserid(expenseresponse.getUser().getId());
        expenseResponseDto.setCategoryid(expenseresponse.getCategory().getCategory_id());

        return expenseResponseDto;

    }
    public List<ExpenseResponseDto> getallexpenses()
    {

        return expenseRepository.findAll()
                .stream()
                .map(expense -> {
                    ExpenseResponseDto dto = new ExpenseResponseDto();
                    dto.setId(expense.getId());
                    dto.setAmount(expense.getAmount());
                    dto.setDescription(expense.getDescription());
                    dto.setUserid(expense.getUser().getId());
                    dto.setCategoryid(expense.getCategory().getCategory_id());
                    return dto;
                })
                .toList();
    }

    public ExpenseResponseDto getexpensebyid(Long id) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        ExpenseResponseDto expenseResponseDto = new ExpenseResponseDto();
        expenseResponseDto.setId(expense.getId());
        expenseResponseDto.setAmount(expense.getAmount());
        expenseResponseDto.setDescription(expense.getDescription());
        expenseResponseDto.setUserid(expense.getUser().getId());
        expenseResponseDto.setCategoryid(expense.getCategory().getCategory_id());

        return expenseResponseDto;
    }

    public ExpenseResponseDto updateexpense(Long id, ExpenseRequestDto expenseRequestDto)
    {
        Expense expense= new Expense();
        expense=expenseRepository.findById(id).orElseThrow(()-> new RuntimeException(" expense not found"));
        expense.setAmount(expenseRequestDto.getAmount());
        expense.setDescription(expenseRequestDto.getDescription());
        Expense expenseresponse =expenseRepository.save(expense);
        ExpenseResponseDto expenseResponseDto=new ExpenseResponseDto();
        expenseResponseDto.setId(expense.getId());
        expenseResponseDto.setAmount(expenseresponse.getAmount());
        expenseResponseDto.setDescription(expenseresponse.getDescription());
        expenseResponseDto.setUserid(expenseresponse.getUser().getId());
        expenseResponseDto.setCategoryid(expenseresponse.getCategory().getCategory_id());

        return expenseResponseDto;
    }

    public void deleteexpense(Long id) {
        expenseRepository.deleteById(id);

    }







}
