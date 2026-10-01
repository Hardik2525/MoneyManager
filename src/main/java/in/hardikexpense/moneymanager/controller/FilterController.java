package in.hardikexpense.moneymanager.controller;

import in.hardikexpense.moneymanager.service.ExpenseService;
import in.hardikexpense.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;

import in.hardikexpense.moneymanager.dto.FilterDTO;
import in.hardikexpense.moneymanager.dto.IncomeDTO;
import in.hardikexpense.moneymanager.dto.ExpenseDTO;
import java.time.LocalDate;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter){
        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
        String keyword = filter.getKeyword() != null ? filter.getKeyword() : "";
        String sortField = filter.getSortField() != null ? filter.getSortField() : "date";
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortField);
        if("income".equals(filter.getType())) {
            List<IncomeDTO> incomes = incomeService.filterIncomes(startDate, endDate, keyword, sort);
            return ResponseEntity.status(HttpStatus.OK).body(incomes);
        } else if("expense".equals(filter.getType())) {
            List<ExpenseDTO> expenses = expenseService.filterExpenses(startDate, endDate, keyword, sort);
            return ResponseEntity.status(HttpStatus.OK).body(expenses);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid type : must be income or expense");

    }
}