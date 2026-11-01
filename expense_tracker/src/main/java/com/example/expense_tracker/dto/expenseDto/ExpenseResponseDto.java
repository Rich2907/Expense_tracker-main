package com.example.expense_tracker.dto.expenseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ExpenseResponseDto {
private Long id;
private double amount;
private String description;
private Long userid;
private Long categoryid;
}
