package in.hardikexpense.moneymanager.service;

import lombok.RequiredArgsConstructor;
import in.hardikexpense.moneymanager.repository.ExpenseRepository;

import org.springframework.stereotype.Service;
import in.hardikexpense.moneymanager.repository.CategoryRepository;
import in.hardikexpense.moneymanager.dto.ExpenseDTO;
import in.hardikexpense.moneymanager.entity.ExpenseEntity;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.entity.CategoryEntity;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;

    public ExpenseDTO addExpense(ExpenseDTO expenseDTO) {
       ProfileEntity profile = profileService.getCurrentProfile();
       CategoryEntity category = categoryRepository.findById(expenseDTO.getCategoryId())
       .orElseThrow(() -> new RuntimeException("Category not found"));
       ExpenseEntity expenseEntity = mapToEntity(expenseDTO, profile, category);
       ExpenseEntity savedExpense = expenseRepository.save(expenseEntity);
       return mapToDTO(savedExpense);
    }

    private ExpenseEntity mapToEntity(ExpenseDTO expenseDTO, ProfileEntity profile, CategoryEntity category) {
        return ExpenseEntity.builder()
            .name(expenseDTO.getName())
            .icon(expenseDTO.getIcon())
            .date(expenseDTO.getDate())
            .amount(expenseDTO.getAmount())
            .profile(profile)
            .categoryEntity(category)
            .build();
    }

    private ExpenseDTO mapToDTO(ExpenseEntity expenseEntity) {
        return ExpenseDTO.builder()
            .id(expenseEntity.getId())
            .name(expenseEntity.getName())
            .icon(expenseEntity.getIcon())
            .date(expenseEntity.getDate())
            .amount(expenseEntity.getAmount())
            .categoryId(expenseEntity.getCategoryEntity()!=null ? expenseEntity.getCategoryEntity().getId() : null)
            .categoryName(expenseEntity.getCategoryEntity()!=null ? expenseEntity.getCategoryEntity().getName() : "N/A")
            .createdAt(expenseEntity.getCreatedAt())
            .updatedAt(expenseEntity.getUpdateAt())
            .build();
    }
}
