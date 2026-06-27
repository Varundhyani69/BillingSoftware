package varun.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import varun.backend.io.ImageUploadResponse;
import varun.backend.service.FileUploadService;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {
    private final FileUploadService fileUploadService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public ImageUploadResponse uploadImage(@RequestPart("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only image files are allowed");
        }
        String imgUrl = fileUploadService.uploadFile(file);
        return ImageUploadResponse.builder()
                .imgUrl(imgUrl)
                .fileName(file.getOriginalFilename())
                .fileSize(file.getSize())
                .contentType(contentType)
                .build();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@RequestParam("url") String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Image URL is required");
        }
        boolean deleted = fileUploadService.deleteFile(imageUrl);
        if (!deleted) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to delete image");
        }
    }
}
