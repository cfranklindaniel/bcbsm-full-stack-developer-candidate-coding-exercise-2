package com.frank.userregistration.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor()
public class UserModel {
    private String username;
    private String firstName;
    private String lastName;
    private String streetAddress;
    private String city;
    private String state;
    private String id;
    private int zip;
    private String password;
    private String userMode;
    private String dateOfBirth;

}
