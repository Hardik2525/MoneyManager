package in.hardikexpense.moneymanager.repository;

import in.hardikexpense.moneymanager.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity,Long>{

    Optional<ProfileEntity> findByEmail(String Email);

    Optional<ProfileEntity> findByActivationToken(String activationToken);

}