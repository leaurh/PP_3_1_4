package web.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import web.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    List<User> findAll();

    boolean saveUser(User user);

    User findById(long id);

    boolean deleteById(Long userId);

    void updateUser(User user);

    User getUserByEmail(String email);

    User getAuthorizedUser();



}
