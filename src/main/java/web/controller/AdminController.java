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
@RequestMapping("/")
public class AdminController {

    @Autowired
    UserService userService;
    @Autowired
    RoleService roleService;

    @GetMapping
    public String adminPage(Model model) {
        return "admin";
    }
}
