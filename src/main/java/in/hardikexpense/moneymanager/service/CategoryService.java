package in.hardikexpense.moneymanager.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import in.hardikexpense.moneymanager.repository.CategoryRepository;
import in.hardikexpense.moneymanager.dto.CategoryDTO;
import in.hardikexpense.moneymanager.entity.CategoryEntity;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import java.util.List;
import lombok.Builder;
import org.springframework.web.server.ResponseStatusException;
import java.util.stream.Collectors;

@Service
@Builder
public class CategoryService {
    private final CategoryRepository categoryRespository;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;

    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        if(categoryRepository.existsByProfileIdAndName(profile.getId(), categoryDTO.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }
        CategoryEntity categoryEntity = mapToEntity(categoryDTO, profile);
        CategoryEntity savedCategory = categoryRepository.save(categoryEntity);
        return mapToDTO(savedCategory);
    }

    public List<CategoryDTO> getCategoriesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categories = categoryRepository.findByProfileId(profile.getId());
        return categories.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    //Helper methods
    private CategoryEntity mapToEntity(CategoryDTO categoryDTO, ProfileEntity profile) {
        return CategoryEntity.builder()
            .name(categoryDTO.getName())
            .type(categoryDTO.getType())
            .icon(categoryDTO.getIcon())
            .profile(profile)
            .build();
    }

    private CategoryDTO mapToDTO(CategoryEntity categoryEntity) {
        return CategoryDTO.builder()
            .id(categoryEntity.getId())
            .name(categoryEntity.getName())
            .type(categoryEntity.getType())
            .icon(categoryEntity.getIcon())
            .createdAt(categoryEntity.getCreatedAt())
            .updatedAt(categoryEntity.getUpdatedAt())
            .profileId(categoryEntity.getProfile().getId())
            .build();
    }

    public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categoryByTypeForCurrentUser = categoryRepository.findByProfileIdAndType(profile.getId(), type);
        return categoryByTypeForCurrentUser.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public CategoryDTO updateCategory(Long categoryId , CategoryDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity existing = categoryRepository.findByIdAndProfileId(categoryId, profile.getId())
                .orElseThrow(() -> new RuntimeException("Category not found or inaccessible"));
        existing.setName((dto.getName()));
        existing.setIcon(dto.getIcon());
        existing = categoryRepository.save(existing);
        return mapToDTO(existing);

    }
}
