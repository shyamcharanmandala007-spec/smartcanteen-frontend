package com.smartcanteen.service;

import com.smartcanteen.entity.MenuItem;
import com.smartcanteen.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long id, MenuItem details) {
        MenuItem item = getMenuItemById(id);
        item.setName(details.getName());
        item.setDescription(details.getDescription());
        item.setPrice(details.getPrice());
        item.setCategory(details.getCategory());
        item.setImageUrl(details.getImageUrl());
        item.setIsVeg(details.getIsVeg());
        item.setIsAvailable(details.getIsAvailable());
        item.setPreparationTimeMinutes(details.getPreparationTimeMinutes());
        return menuItemRepository.save(item);
    }

    public void deleteMenuItem(Long id) {
        MenuItem item = getMenuItemById(id);
        menuItemRepository.delete(item);
    }

    public MenuItem toggleAvailability(Long id) {
        MenuItem item = getMenuItemById(id);
        item.setIsAvailable(!item.getIsAvailable());
        return menuItemRepository.save(item);
    }
}
