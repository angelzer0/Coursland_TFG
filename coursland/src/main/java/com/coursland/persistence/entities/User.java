package com.coursland.persistence.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Entidad que representa un usuario en la base de datos.
 */
@Data
@Entity
@Table(name = "T_USUARIOS")
public class User implements Serializable, UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_ID_USUARIO")
    private Long idUsuario;

    @Column(name = "C_NOMBRE")
    private String nombre;

    @Column(name = "C_CORREO")
    private String email;

    @Column(name = "C_CLAVE")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "T_USUARIO_ROLES",
            joinColumns = @JoinColumn(name = "C_USUARIO_ID", referencedColumnName = "C_ID_USUARIO")
            , inverseJoinColumns = @JoinColumn(name = "C_ROL_ID", referencedColumnName = "C_ID_ROL"))

    private List<Rol> roles = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertir los roles del usuario en una lista de GrantedAuthority
        return roles.stream()
                .map(rol -> new SimpleGrantedAuthority(rol.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        // Devuelve el correo electrónico como nombre de usuario
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Devuelve true para indicar que la cuenta del usuario no ha expirado
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Devuelve true para indicar que la cuenta del usuario no está bloqueada
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Devuelve true para indicar que las credenciales del usuario no han expirado
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Devuelve true para indicar que la cuenta del usuario está habilitada
        return true;
    }
}

