package varun.backend.service;

import org.springframework.web.multipart.MultipartFile;
import varun.backend.io.CategoryRequest;
import varun.backend.io.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request, MultipartFile file);
    List<CategoryResponse> read();
    void delete(String categoryId);
}
