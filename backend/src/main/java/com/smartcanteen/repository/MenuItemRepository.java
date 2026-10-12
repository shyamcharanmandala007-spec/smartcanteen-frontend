package com.smartcanteen.repository;

import com.smartcanteen.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(String category);
    List<MenuItem> findByIsAvailableTrue();
    List<MenuItem> findByNameContainingIgnoreCase(String keyword);
}
