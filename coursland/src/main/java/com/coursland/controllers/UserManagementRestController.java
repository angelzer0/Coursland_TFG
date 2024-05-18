package com.coursland.controllers;

import com.coursland.dto.UserDTO;
import com.coursland.persistence.entities.User;
import com.coursland.services.interfaces.UserManagementServiceI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la gestión de usuarios.
 */
@RestController
public class UserManagementRestController {

    private static final Logger log = LoggerFactory.getLogger(UserManagementRestController.class);

    @Autowired
    private UserManagementServiceI usersManagementService;

    /**
     * Registra un nuevo usuario.
     *
     * @param reg DTO del usuario a registrar.
     * @return ResponseEntity con el DTO del usuario registrado.
     */
    @PostMapping("/auth/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO reg) {
        log.info("El usuario {} ha sido registrado", reg.getEmail());
        UserDTO response = usersManagementService.register(reg);
        return ResponseEntity.ok(response);
    }

    /**
     * Inicia sesión para un usuario existente.
     *
     * @param req DTO del usuario para iniciar sesión.
     * @return ResponseEntity con el DTO del usuario que inició sesión.
     */
    @PostMapping("/auth/login")
    public ResponseEntity<UserDTO> login(@RequestBody UserDTO req) {
        log.info("El usuario {} ha iniciado sesión", req.getEmail());
        UserDTO response = usersManagementService.login(req);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza el token de acceso para un usuario.
     *
     * @param req DTO del usuario para actualizar el token.
     * @return ResponseEntity con el DTO del usuario con el token actualizado.
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<UserDTO> refreshToken(@RequestBody UserDTO req) {
        log.info("Se ha actualizado el token de acceso para el usuario {}", req.getEmail());
        UserDTO response = usersManagementService.refreshToken(req);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene todos los usuarios.
     *
     * @return ResponseEntity con el DTO que contiene todos los usuarios.
     */
    @GetMapping("/adminuser/get-all-users")
    public ResponseEntity<UserDTO> getAllUsers() {
        log.info("Lista de todos los usuarios recuperada");
        UserDTO response = usersManagementService.getAllUsers();
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene un usuario por su ID.
     *
     * @param userId ID del usuario a obtener.
     * @return ResponseEntity con el DTO del usuario obtenido.
     */
    @GetMapping("/adminuser/get-users/{userId}")
    public ResponseEntity<UserDTO> getUserByID(@PathVariable Integer userId) {
        log.info("Se ha recuperado el usuario con ID: {}", userId);
        UserDTO response = usersManagementService.getUsersById(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualiza un usuario existente.
     *
     * @param userId ID del usuario a actualizar.
     * @param reqres Usuario con los nuevos datos.
     * @return ResponseEntity con el DTO del usuario actualizado.
     */
    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer userId, @RequestBody User reqres) {
        log.info("El usuario con ID: {} ha sido actualizado", userId);
        UserDTO response = usersManagementService.updateUser(userId, reqres);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene el perfil del usuario autenticado.
     *
     * @return ResponseEntity con el DTO que contiene la información del perfil del usuario autenticado.
     */
    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<UserDTO> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        log.info("Se ha recuperado el perfil del usuario: {}", email);
        UserDTO response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Elimina un usuario por su ID.
     *
     * @param userId ID del usuario a eliminar.
     * @return ResponseEntity con el DTO que contiene información sobre la eliminación del usuario.
     */
    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<UserDTO> deleteUserById(@PathVariable Long userId) {
        log.info("El usuario con ID: {} ha sido eliminado", userId);
        UserDTO response = usersManagementService.deleteUserById(userId);
        return ResponseEntity.ok(response);
    }
}
