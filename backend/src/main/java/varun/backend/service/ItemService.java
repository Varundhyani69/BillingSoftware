package varun.backend.service;

import org.springframework.web.multipart.MultipartFile;
import varun.backend.io.ItemRequest;
import varun.backend.io.ItemResponse;

import java.util.List;

public interface ItemService {
    ItemResponse add(ItemRequest request, MultipartFile file);
    List<ItemResponse> fetchItems();
    void deleteItem(String itemId);
}
