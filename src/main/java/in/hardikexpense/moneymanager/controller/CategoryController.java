package in.hardikexpense.moneymanager.controller;

import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import in.hardikexpense.moneymanager.dto.CategoryDTO;
import java.util.List;
import org.springframework.http.HttpStatus;
import in.hardikexpense.moneymanager.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor

public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDTO> saveCategory(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.saveCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategoriesForCurrentUser() {
        List<CategoryDTO> categories = categoryService.getCategoriesForCurrentUser();
        return ResponseEntity.status(HttpStatus.OK).body(categories);
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByTypeForCurrentUser(@PathVariable String type){
        List<CategoryDTO> cats = categoryService.getCategoriesByTypeForCurrentUser(type);
        return ResponseEntity.status(HttpStatus.OK).body(cats);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long categoryId ,@RequestBody CategoryDTO categoryDTO){
        CategoryDTO updateCategory = categoryService.updateCategory(categoryId,categoryDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updateCategory);
    }
    
}
