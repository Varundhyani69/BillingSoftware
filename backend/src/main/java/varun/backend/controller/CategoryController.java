package varun.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import varun.backend.io.CategoryRequest;
import varun.backend.io.CategoryResponse;
import varun.backend.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(
            @RequestPart("category") String categoryString,
            @RequestPart("file") MultipartFile file) {

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            CategoryRequest request =
                    objectMapper.readValue(categoryString, CategoryRequest.class);

            return categoryService.add(request, file);

        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Exception occurred while parsing JSON: " + ex.getMessage()
            );
        }
    }

    @GetMapping
    public List<CategoryResponse> fetchCategories() {
        return categoryService.read();
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable String categoryId) {
        try {
            categoryService.delete(categoryId);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Category not found: " + e.getMessage()
            );
        }
    }
}