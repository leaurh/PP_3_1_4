package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.RoleService;
import web.service.UserService;

import javax.annotation.PostConstruct;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void addTestRoles(){
        roleService.saveRole(new Role("ROLE_ADMIN"));
        roleService.saveRole(new Role("ROLE_USER"));
    }

    @PostConstruct
    public void addTestUsers(){
        roleService.saveRole(new Role("ROLE_ADMIN"));
        roleService.saveRole(new Role("ROLE_USER"));
        userService.saveUser(new User("admin", "admin", "admin@gmail.com", "admin", roleService.getRole("ROLE_ADMIN")));
        userService.saveUser(new User("user", "user", "user@gmail.com", "user", roleService.getRole("ROLE_USER")));
    }

    @GetMapping("/")
    public String adminPage(Model model) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("newUser", new User());
        model.addAttribute("authorizedUser", (User) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal());
        return "admin";
    }

    @PostMapping("/")
    public String addUser(@ModelAttribute("newUser") User user) {
        userService.saveUser(user);
        return "redirect:/admin/";
    }



    @GetMapping("/{id}/edit")
    public String editUser(@PathVariable("id") Long id, Model model) {
        User userToEdit = userService.findById(id);
        String roleUser = (userToEdit.getStringRoles().contains("ROLE_USER") ? "on" : null);
        String roleAdmin = (userToEdit.getStringRoles().contains("ROLE_ADMIN") ? "on" : null);

        model.addAttribute("userToEdit", userService.findById(id));
        model.addAttribute("roleUser", roleUser);
        model.addAttribute("roleAdmin", roleAdmin);
        return "adminController/edit";
    }

    @PutMapping("/{id}")
    public String update(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin/";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin/";
    }
}
