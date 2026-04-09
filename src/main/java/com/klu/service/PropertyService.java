package com.klu.service;

import com.klu.entity.Property;
import com.klu.exception.ResourceNotFoundException;
import com.klu.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository repository;

    public PropertyService(PropertyRepository repository) {
        this.repository = repository;
    }

    public List<Property> findAll() {
        return repository.findAll();
    }

    public List<Property> findByUserId(Long userId) {
        return repository.findByOwnerId(userId);
    }

    public Property findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id " + id));
    }

    public Property create(Property property) {
        return repository.save(property);
    }

    public Property update(Long id, Property updatedProperty) {
        Property existingProperty = findById(id);
        existingProperty.setType(updatedProperty.getType());
        existingProperty.setCity(updatedProperty.getCity());
        existingProperty.setArea(updatedProperty.getArea());
        existingProperty.setSize(updatedProperty.getSize());
        existingProperty.setAge(updatedProperty.getAge());
        existingProperty.setBudget(updatedProperty.getBudget());
        existingProperty.setIssues(updatedProperty.getIssues());
        existingProperty.setLocation(updatedProperty.getLocation());
        existingProperty.setImage(updatedProperty.getImage());
        existingProperty.setStatus(updatedProperty.getStatus());
        existingProperty.setAdminNote(updatedProperty.getAdminNote());
        existingProperty.setOwnerId(updatedProperty.getOwnerId());
        existingProperty.setUserName(updatedProperty.getUserName());
        existingProperty.setSubmittedAt(updatedProperty.getSubmittedAt());
        return repository.save(existingProperty);
    }

    public void delete(Long id) {
        Property property = findById(id);
        repository.delete(property);
    }
}
