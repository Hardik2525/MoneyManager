package in.hardikexpense.moneymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import in.hardikexpense.moneymanager.entity.CategoryEntity;
import java.util.List;

public interface CategoryRespository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findByProfileId(Long profileId);
    Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
    List<CategoryEntity> findByProfileIdAndType(Long profileId, String type);
    Boolean existsByProfileIdAndName(Long profileId, String name);
}
