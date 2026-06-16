package varun.backend.service;

import varun.backend.io.CategoryRequest;
import varun.backend.io.CategoryResponse;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request);
}
