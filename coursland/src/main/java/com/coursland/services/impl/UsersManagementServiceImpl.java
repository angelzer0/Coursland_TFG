package com.coursland.services.impl;

import com.coursland.dto.UserDTO;
import com.coursland.persistence.entities.Rol;
import com.coursland.persistence.entities.User;
import com.coursland.persistence.repository.UserRepository;
import com.coursland.security.JWTUtils;
import com.coursland.services.interfaces.UserManagementServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementServiceImpl implements UserManagementServiceI {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;


    /**
     * Método para registrar un nuevo usuario.
     */
    public UserDTO register(UserDTO registrationRequest) {
        UserDTO resp = new UserDTO();

        try {
            // Verificar si el correo electrónico ya está registrado
            Optional<User> existingUser = userRepository.findByEmail(registrationRequest.getEmail());
            if (existingUser.isPresent()) {
                resp.setStatusCode(400);
                resp.setMessage("El correo electrónico ya está registrado");
                return resp;
            }

            User user = new User();
            user.setEmail(registrationRequest.getEmail());
            user.setNombre(registrationRequest.getNombre());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            // Asignar el rol "USER" como predeterminado
            Rol userRole = new Rol();
            userRole.setName("USER");
            List<Rol> roles = new ArrayList<>();
            roles.add(userRole);
            user.setRoles(roles);

            User userResult = userRepository.save(user);
            if (userResult.getIdUsuario() > 0) {
                resp.setUser(userResult);
                resp.setMessage("Usuario registrado exitosamente");
                resp.setStatusCode(200);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }



    /**
     * Método para iniciar sesión.
     */
    public UserDTO login(UserDTO loginRequest){
        UserDTO response = new UserDTO();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                    loginRequest.getPassword()));
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRoles(user.getRoles());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Inicio de sesión exitoso");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    /**
     * Método para refrescar el token de autenticación.
     */
    public UserDTO refreshToken(UserDTO refreshTokenRequest){
        UserDTO response = new UserDTO();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User user = userRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), user)) {
                String jwt = jwtUtils.generateToken(user);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Token refrescado exitosamente");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    /**
     * Método para obtener todos los usuarios.
     */
    public UserDTO getAllUsers() {
        UserDTO reqRes = new UserDTO();

        try {
            List<User> result = userRepository.findAll();
            if (!result.isEmpty()) {
                reqRes.setUserList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Éxito");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No se encontraron usuarios");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Se produjo un error: " + e.getMessage());
            return reqRes;
        }
    }

    /**
     * Método para eliminar un usuario por su ID.
     */
    public UserDTO deleteUserById(Long id) {
        UserDTO reqRes = new UserDTO();
        try {
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                userRepository.delete(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Usuario eliminado exitosamente");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Usuario no encontrado para eliminación");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Se produjo un error al eliminar el usuario: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Método para obtener un usuario por su ID.
     */
    public UserDTO getUsersById(Integer id) {
        UserDTO reqRes = new UserDTO();
        try {
            User userById = userRepository.findById(Long.valueOf(id)).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            reqRes.setUser(userById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Usuario con ID '" + id + "' encontrado exitosamente");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Se produjo un error: " + e.getMessage());
        }
        return reqRes;
    }


    /**
     * Método para actualizar un usuario.
     */
    public UserDTO updateUser(Integer userId, User updatedUser) {
        UserDTO reqRes = new UserDTO();
        try {
            Optional<User> userOptional = userRepository.findById(Long.valueOf(userId));
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setNombre(updatedUser.getNombre());
                existingUser.setRoles(updatedUser.getRoles());

                // Verificar si la contraseña está presente en la solicitud
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Codificar la contraseña y actualizarla
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                User savedUser = userRepository.save(existingUser);
                reqRes.setUser(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Usuario actualizado exitosamente");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Usuario no encontrado para actualización");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Se produjo un error al actualizar el usuario: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Método para obtener la información del usuario actual.
     */
    public UserDTO getMyInfo(String email){
        UserDTO reqRes = new UserDTO();
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Éxito");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Usuario no encontrado para actualización");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Se produjo un error al obtener la información del usuario: " + e.getMessage());
        }
        return reqRes;

    }
}
