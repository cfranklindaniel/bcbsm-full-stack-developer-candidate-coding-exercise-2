package com.frank.userregistration.controller;

import com.frank.userregistration.model.UserModel;
import com.frank.userregistration.mongodb.UserDocument;
import com.frank.userregistration.service.UserRegistrationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/user")
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", allowCredentials = "true", allowedHeaders = "*")
public class UserRegistrationController {

    @Autowired
    private UserRegistrationService userRegistrationService;

    @PostMapping("/registerUpdateUser")
    public ResponseEntity<UserModel> registerUpdateUser(@RequestBody UserModel userModel) {
        log.info("registerUpdateUser: userMode is {} for username {}", userModel.getUserMode(), userModel.getUsername());
        try {
            userRegistrationService.saveUser(userModel);
        } catch (Exception e) {
            log.error("Error in registerUpdateUser: userMode is {} for username {} error is {}",
                    userModel.getUserMode(), userModel.getUsername(), e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(userModel, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<UserModel> login() {
        UserModel userModel = getUserModel();
        log.info("login for username {}", userModel.getUsername());
        return new ResponseEntity<>(getUserModel(), HttpStatus.OK);
    }
    private UserModel getUserModel() {
        UserDocument userDocument = userRegistrationService.getUser(getUsername());
        UserModel userModel = new UserModel(userDocument.getUserName(),
                userDocument.getFirstName(),
                userDocument.getLastName(),
                userDocument.getStreetAddress(),
                userDocument.getCity(),
                userDocument.getState(),
                userDocument.getUserName(),
                userDocument.getZip(),
                userDocument.getPassword(),
                null,
                userDocument.getDateOfBirth());
        return userModel;
    }
    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ((UserDetails) auth.getPrincipal()).getUsername();
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserModel>> getUsers() {
        return new ResponseEntity<>(Arrays.asList(getUserModel()), HttpStatus.OK);
    }

    @GetMapping("/getUser")
    public ResponseEntity<UserModel> getUser() {
        return new ResponseEntity<>(getUserModel(), HttpStatus.OK);
    }
}
