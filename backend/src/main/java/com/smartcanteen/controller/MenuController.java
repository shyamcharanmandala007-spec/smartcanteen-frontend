package com.smartcanteen.controller;

import com.smartcanteen.entity.MenuItem;
import com.smartcanteen.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenu(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(menuService.getMenuItemsByCategory(category));
        }
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenu() {
        return ResponseEntity.ok(menuService.getAvailableMenuItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }
}
