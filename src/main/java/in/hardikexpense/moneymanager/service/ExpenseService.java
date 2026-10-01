package in.hardikexpense.moneymanager.service;

import lombok.RequiredArgsConstructor;
import in.hardikexpense.moneymanager.repository.ExpenseRepository;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import in.hardikexpense.moneymanager.repository.CategoryRepository;
import in.hardikexpense.moneymanager.dto.ExpenseDTO;
import in.hardikexpense.moneymanager.entity.ExpenseEntity;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.entity.CategoryEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    //Retreive all expenses for a profile based on start and end date
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> expenses = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return expenses.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    //delete expense by id for current user
    public void deleteExpense(Long expenseId){
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity entity = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if(!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        expenseRepository.delete(entity);
    }

    //Get latest 5 expenses for the current user
    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> entity = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return entity.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public BigDecimal getTotalExpenseForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total =  expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total !=null ? total : BigDecimal.ZERO;
    }

    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase
                (profile.getId(),startDate,endDate,keyword,sort);
        return list.stream().map(this::mapToDTO).toList();
    }

    //Notifications
    public List<ExpenseDTO> getExpensesForUserOnDate(Long profileId,LocalDate date){
        List<ExpenseEntity> ls = expenseRepository.findByProfileIdAndDate(profileId,date);
        return ls.stream().map(this::mapToDTO).toList();
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
