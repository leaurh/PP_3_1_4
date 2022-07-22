package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web.model.User;
import web.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class RestAdminController {
    private final UserService userService;

    @Autowired
    public RestAdminController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public List<User> showAllUsers() {
        return userService.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public List<User> addUser(@RequestBody User user) {
        userService.saveUser(user);
        return userService.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public User findUser(@PathVariable long id) {
        return userService.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public List<User> updateUser(@RequestBody User user, @PathVariable Long id) {
        user.setId(id);
        userService.updateUser(user);
        return userService.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public List<User> deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
        return userService.findAll();
    }

    @GetMapping("/auth_user")
    public User getAuthUser() {
        return userService.getAuthorizedUser();
    }

}
