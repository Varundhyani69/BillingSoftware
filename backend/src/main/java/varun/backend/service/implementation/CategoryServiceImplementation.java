package varun.backend.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import varun.backend.entity.CategoryEntity;
import varun.backend.io.CategoryRequest;
import varun.backend.io.CategoryResponse;
import varun.backend.repository.CategoryRepository;
import varun.backend.service.CategoryService;

import java.util.UUID;
@Service
@RequiredArgsConstructor
public class CategoryServiceImplementation  implements CategoryService {
    private final CategoryRepository categoryRepository;
    @Override
    public CategoryResponse add (CategoryRequest request){
        CategoryEntity newCategory = convertToEntity(request);
        newCategory = categoryRepository.save(newCategory);
        return convertToResponse(newCategory);

    }
    private CategoryEntity convertToEntity(CategoryRequest request){
        return CategoryEntity.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .bgColor(request.getBgColor())
                .build();
    }
    private CategoryResponse convertToResponse(CategoryEntity newCategory){
        return CategoryResponse.builder()
                .categoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .description(newCategory.getDescription())
                .bgColor(newCategory.getBgColor())
                .imgUrl(newCategory.getImgUrl())
                .createdAt(newCategory.getCreatedAt())
                .updatedAt(newCategory.getUpdatedAt())
                .build();
    }
}
