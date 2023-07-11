package com.frank.userregistration.service;

import com.frank.userregistration.model.UserModel;
import com.frank.userregistration.mongodb.UserDocument;
import com.frank.userregistration.mongodb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserRegistrationService {

    @Autowired
    UserRepository userRepository;

    public void saveUser(UserModel userModel) {
        UserDocument userDocument = new UserDocument(userModel.getUsername(),
                userModel.getFirstName(),
                userModel.getLastName(),
                userModel.getStreetAddress(),
                userModel.getCity(),
                userModel.getState(),
                userModel.getZip(),
                userModel.getPassword(),
                userModel.getDateOfBirth());
        if ("Register".equals(userModel.getUserMode())) {
            userRepository.insert(userDocument);
            return;
        }
        UserDocument existingUserDocument = getUser(userModel.getUsername());
        userDocument.setPassword(existingUserDocument.getPassword());
        userDocument.setUserName(existingUserDocument.getUserName());
        userDocument.setDateOfBirth(existingUserDocument.getDateOfBirth());
        userRepository.save(userDocument);
    }

    public UserDocument getUser(String userName) {
        Optional<UserDocument> userDocument = userRepository.findById(userName);
        return userDocument.isPresent() ? userDocument.get() : null;
    }
}
