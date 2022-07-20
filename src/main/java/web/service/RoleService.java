package web.service;

import web.model.Role;

import java.util.Set;

public interface RoleService {
    Set<Role> getAllRoles();

    Set<Role> getRole(String role);

    boolean saveRole(Role role);

}
