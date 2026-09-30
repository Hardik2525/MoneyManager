package in.hardikexpense.moneymanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import in.hardikexpense.moneymanager.dto.IncomeDTO;
import in.hardikexpense.moneymanager.service.IncomeService;
import java.util.List;
@RestController
@RequestMapping("/incomes")
@RequiredArgsConstructor
public class IncomeController {
    private final IncomeService incomeService;
    @PostMapping
    public ResponseEntity<IncomeDTO> addIncome(@RequestBody IncomeDTO incomeDTO) {
        IncomeDTO savedIncome = incomeService.addIncome(incomeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIncome);
    }

    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getCurrentMonthIncomesForCurrentUser() {
        List<IncomeDTO> incomes = incomeService.getCurrentMonthIncomesForCurrentUser();
        return ResponseEntity.status(HttpStatus.OK).body(incomes);
    }

    @DeleteMapping("/{incomeId}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long incomeId){
        incomeService.deleteIncome(incomeId);
        return ResponseEntity.noContent().build();
    }
}
