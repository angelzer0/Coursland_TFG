package com.coursland.services.interfaces;

import com.coursland.dto.UserDTO;
import com.coursland.persistence.entities.User;

public interface UserManagementServiceI {

    UserDTO register(UserDTO registrationRequest);

    UserDTO login(UserDTO loginRequest);

    UserDTO refreshToken(UserDTO refreshTokenRequest);

    UserDTO getAllUsers();

    UserDTO deleteUserById(Long id);

    UserDTO getUsersById(Integer id);

    UserDTO updateUser(Integer userId, User updatedUser);

    UserDTO getMyInfo(String email);
}
