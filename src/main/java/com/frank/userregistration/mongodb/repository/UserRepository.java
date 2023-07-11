package com.frank.userregistration.mongodb.repository;

import com.frank.userregistration.mongodb.UserDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserDocument, String> {
}
