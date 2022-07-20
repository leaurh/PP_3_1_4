package web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.model.Role;
import web.model.User;
import web.repository.RoleRepository;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Set<Role> getAllRoles() {
        return new HashSet<>(roleRepository.findAll());
    }

    @Override
    public Set<Role> getRole(String role) {
        return roleRepository.findByName(role);
    }


    @Override
    public boolean saveRole(Role role) {
        Set<Role> roleDB = roleRepository.findByName(role.getName());
        if (roleDB.size() == 0 || roleDB != null) {
            return false;
        }
        roleRepository.save(role);
        return true;
    }

}
