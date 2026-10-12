package com.smartcanteen.config;

import com.smartcanteen.entity.MenuItem;
import com.smartcanteen.entity.Role;
import com.smartcanteen.entity.User;
import com.smartcanteen.repository.MenuItemRepository;
import com.smartcanteen.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, MenuItemRepository menuItemRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default Admin if not exists
        if (!userRepository.existsByEmail("admin@canteen.edu")) {
            User admin = new User(
                    "Canteen Head Chef",
                    "admin@canteen.edu",
                    passwordEncoder.encode("admin123"),
                    Role.ROLE_ADMIN,
                    5000.0
            );
            userRepository.save(admin);
        }

        // Seed default Student if not exists
        if (!userRepository.existsByEmail("student@campus.edu")) {
            User student = new User(
                    "Arjun Sharma",
                    "student@campus.edu",
                    passwordEncoder.encode("student123"),
                    Role.ROLE_STUDENT,
                    350.0
            );
            userRepository.save(student);
        }

        // Seed Menu Items if table is empty
        if (menuItemRepository.count() == 0) {
            List<MenuItem> items = List.of(
                    new MenuItem("Masala Dosa with Sambar", "Crispy golden crepe served with hot lentil stew and coconut chutney", 65.0, "Breakfast", "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400", true, true, 8),
                    new MenuItem("Paneer Butter Masala Combo", "Rich cottage cheese gravy served with 2 butter naans and jeera rice", 140.0, "Lunch", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400", true, true, 15),
                    new MenuItem("Chicken Biryani Special", "Fragrant basmati rice layered with spiced chicken and served with raita", 180.0, "Lunch", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", false, true, 12),
                    new MenuItem("Crispy Veg Burger & Fries", "Grilled mixed-veg patty with lettuce, cheddar cheese and fries", 85.0, "Snacks", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", true, true, 10),
                    new MenuItem("Cold Coffee with Ice Cream", "Chilled whipped Arabica blend topped with vanilla scoop", 60.0, "Beverages", "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400", true, true, 5),
                    new MenuItem("Hot Masala Chai", "Fresh brewed Assam tea leaves with cardamom and ginger spices", 20.0, "Beverages", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400", true, true, 3),
                    new MenuItem("Warm Chocolate Brownie", "Sizzling fudge brownie drizzled with warm chocolate sauce", 75.0, "Desserts", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", true, true, 6)
            );
            menuItemRepository.saveAll(items);
        }
    }
}
