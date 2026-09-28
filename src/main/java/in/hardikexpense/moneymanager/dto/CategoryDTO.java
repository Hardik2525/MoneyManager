package in.hardikexpense.moneymanager.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String icon;
    private Long profileId;
}
