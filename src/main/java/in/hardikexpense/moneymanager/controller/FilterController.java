package in.hardikexpense.moneymanager.controller;

import in.hardikexpense.moneymanager.service.ExpenseService;
import in.hardikexpense.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.hardikexpense.moneymanager.dto.FilterDTO;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<?> filterTransactions(RequestBody FilterDTO filter){
        LocalDate startDate = filter.getStartDate()

    }
}
