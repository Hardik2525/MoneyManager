package in.hardikexpense.moneymanager.service;

import in.hardikexpense.moneymanager.dto.ExpenseDTO;
import in.hardikexpense.moneymanager.entity.ExpenseEntity;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import in.hardikexpense.moneymanager.repository.IncomeRepository;
import in.hardikexpense.moneymanager.repository.CategoryRepository;
import in.hardikexpense.moneymanager.entity.IncomeEntity;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.dto.IncomeDTO;
import in.hardikexpense.moneymanager.entity.CategoryEntity;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;
    private final ExcelService excelService;
    private final EmailService emailService;

    public IncomeDTO addIncome(IncomeDTO incomeDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(incomeDTO.getCategoryId())
        .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity incomeEntity = mapToEntity(incomeDTO, profile, category);
        IncomeEntity savedIncome = incomeRepository.save(incomeEntity);
        return mapToDTO(savedIncome);
     }

    public void deleteIncome(Long incomeId){
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        if(!entity.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to delete this income");
        }
        incomeRepository.delete(entity);
    }

    //Retreive all incomes for a profile based on start and end date
    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> incomes = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return incomes.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    //Get latest 5 expenses for the current user
    public List<IncomeDTO> getLatest5IncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> entity = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return entity.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public BigDecimal getTotalIncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total =  incomeRepository.findTotalExpenseByProfileId(profile.getId());
        return total !=null ? total : BigDecimal.ZERO;
    }

    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase
                (profile.getId(),startDate,endDate,keyword,sort);
        return list.stream().map(this::mapToDTO).toList();
    }

    public byte[] getIncomeExcel() {
        List<ExcelService.ExcelRow> rows = getCurrentMonthIncomesForCurrentUser().stream()
                .map(income -> new ExcelService.ExcelRow(
                        income.getName(), income.getCategoryName(), income.getDate(), income.getAmount()))
                .toList();
        return excelService.create("Income", rows);
    }

    public void emailIncomeExcel() {
        ProfileEntity profile = profileService.getCurrentProfile();
        String body = "<p>Hi " + profile.getFullName() + ",</p>"
                + "<p>Your income report for this month is attached.</p>";
        emailService.sendHtmlEmailWithAttachment(
                profile.getEmail(),
                "Your income report",
                body,
                "income.xlsx",
                getIncomeExcel()
        );
    }


    private IncomeEntity mapToEntity(IncomeDTO incomeDTO, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder()
            .name(incomeDTO.getName())
            .icon(incomeDTO.getIcon())
            .date(incomeDTO.getDate())
            .amount(incomeDTO.getAmount())
            .profile(profile)
            .categoryEntity(category)
            .build();
    }

    private IncomeDTO mapToDTO(IncomeEntity incomeEntity) {
        return IncomeDTO.builder()
            .id(incomeEntity.getId())
            .name(incomeEntity.getName())
            .icon(incomeEntity.getIcon())
            .date(incomeEntity.getDate())
            .amount(incomeEntity.getAmount())
            .categoryId(incomeEntity.getCategoryEntity()!=null ? incomeEntity.getCategoryEntity().getId() : null)
            .categoryName(incomeEntity.getCategoryEntity()!=null ? incomeEntity.getCategoryEntity().getName() : "N/A")
            .createdAt(incomeEntity.getCreatedAt())
            .updatedAt(incomeEntity.getUpdateAt())
            .build();
    }
}
