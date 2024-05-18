package com.coursland.services.impl;

import com.coursland.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementación de la interfaz UserDetailsService que carga los detalles del usuario por su nombre de usuario (correo electrónico).
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Carga los detalles del usuario por su nombre de usuario (correo electrónico).
     *
     * @param username El nombre de usuario (correo electrónico) del usuario.
     * @return Los detalles del usuario.
     * @throws UsernameNotFoundException Si no se encuentra ningún usuario con el nombre de usuario especificado.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElseThrow(() ->
                new UsernameNotFoundException("Usuario no encontrado con el nombre de usuario: " + username));
    }
}
