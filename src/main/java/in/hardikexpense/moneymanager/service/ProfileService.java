package in.hardikexpense.moneymanager.service;

import in.hardikexpense.moneymanager.dto.AuthDTO;
import in.hardikexpense.moneymanager.dto.ProfileDTO;
import in.hardikexpense.moneymanager.entity.ProfileEntity;
import in.hardikexpense.moneymanager.repository.ProfileRepository;
import in.hardikexpense.moneymanager.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    @Value("${app.activation.url}")
    private String activationURL ;

    public ProfileDTO registerProfile(ProfileDTO profileDTO){

        ProfileEntity newProfile = toEntity(profileDTO);
        newProfile.setActivationToken((UUID.randomUUID().toString()));
        newProfile = profileRepository.save(newProfile);

        String activationLink =
                activationURL + "/api/v1.0/activate?token=" + newProfile.getActivationToken();
        String subject = "MONEY MANAGER | Activate your Money Manager account";
        String emailBody = String.format(
                "<html><body style=\"font-family: Arial, sans-serif; color: #333;\">" +
                        "<p>Hi %s,</p>" +
                        "<p>Welcome to Money Manager! Please activate your account by clicking the button below:</p>" +
                        "<p><a href=\"%s\" style=\"display: inline-block; padding: 10px 20px; " +
                        "background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;\">" +
                        "Activate Account</a></p>" +
                        "<p>Or copy and paste this link: %s</p>" +
                        "<p><br><br>Best regards,<br>Money Manager Team</p>" +
                        "</body></html>",
                HtmlUtils.htmlEscape(newProfile.getFullName()),
                HtmlUtils.htmlEscape(activationLink),
                HtmlUtils.htmlEscape(activationLink)
        );
        String recipientEmail = newProfile.getEmail();
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendHtmlEmail(recipientEmail, subject, emailBody);
            } catch (Exception e) {
                System.err.println("Failed to send activation email: " + e.getMessage());
            }
        });

        return toDTO(newProfile);
    }

    public ProfileEntity toEntity(ProfileDTO profileDTO){
        return ProfileEntity.builder()
                .id(profileDTO.getId())
                .fullName(profileDTO.getFullName())
                .email(profileDTO.getEmail())
                .password(passwordEncoder.encode(profileDTO.getPassword()))
                .profileImageUrl(profileDTO.getProfileImageUrl())
                .createdAt(profileDTO.getCreatedAt())
                .updatedAt(profileDTO.getUpdatedAt())
                .build();
    }

    public ProfileDTO toDTO(ProfileEntity profileEntity){
        return ProfileDTO.builder()
                .id(profileEntity.getId())
                .fullName(profileEntity.getFullName())
                .email(profileEntity.getEmail())
                .profileImageUrl(profileEntity.getProfileImageUrl())
                .createdAt(profileEntity.getCreatedAt())
                .updatedAt(profileEntity.getUpdatedAt())
                .build();

    }

    public boolean activateProfile(String activationToken){
        return profileRepository.findByActivationToken(activationToken)
                .map(profile ->{
                    profile.setIsActive(true);
                    profileRepository.save(profile);
                    return true;
                } )
                .orElse(false);
    }

    public boolean isAccountActive(String email){
        return profileRepository.findByEmail(email)
                .map(ProfileEntity::getIsActive)
                .orElse(false);
    }

    public ProfileEntity getCurrentProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return profileRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found with email:" + authentication.getName()));
    }

    public ProfileDTO getPublicProfile(String email){
        ProfileEntity currentUser = null;
        if(email==null){
            currentUser = getCurrentProfile();
        }else{
            currentUser = profileRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Profile not found with email: " + email));
        }
        return ProfileDTO.builder()
                .id(currentUser.getId())
                .fullName(currentUser.getFullName())
                .email(currentUser.getEmail())
                .profileImageUrl(currentUser.getProfileImageUrl())
                .createdAt(currentUser.getCreatedAt())
                .updatedAt(currentUser.getUpdatedAt())
                .build();
    }

    public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
        try{
            authenticationManager.authenticate((new UsernamePasswordAuthenticationToken(authDTO.getEmail(),authDTO.getPassword())));
            return Map.of(
                    "token" , jwtUtil.generateToken(authDTO.getEmail()),
                    "user" , getPublicProfile(authDTO.getEmail())
            );
        }catch (Exception e){
            throw new RuntimeException("Invalid email or password");
        }
    }
}