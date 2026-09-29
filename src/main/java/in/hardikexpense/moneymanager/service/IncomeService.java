package in.hardikexpense.moneymanager.service;

import org.springframework.stereotype.Service;

import in.hardikexpense.moneymanager.repository.IncomeRepository;
import in.hardikexpense.moneymanager.repository.CategoryRepository;
import in.hardikexpense.moneymanager.entity.IncomeEntity;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.dto.IncomeDTO;
import in.hardikexpense.moneymanager.entity.CategoryEntity;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;

    public IncomeDTO addIncome(IncomeDTO incomeDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(incomeDTO.getCategoryId())
        .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity incomeEntity = mapToEntity(incomeDTO, profile, category);
        IncomeEntity savedIncome = incomeRepository.save(incomeEntity);
        return mapToDTO(savedIncome);
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
