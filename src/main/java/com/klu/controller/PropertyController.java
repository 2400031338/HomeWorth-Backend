package com.klu.controller;

import com.klu.dto.PropertyDTO;
import com.klu.entity.Property;
import com.klu.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService service;

    public PropertyController(PropertyService service) {
        this.service = service;
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return service.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Property> getPropertiesByUser(@PathVariable Long userId) {
        return service.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Property createProperty(@Valid @RequestBody PropertyDTO dto) {
        Property property = dto.toEntity();
        return service.create(property);
    }

    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id, @Valid @RequestBody PropertyDTO dto) {
        Property property = dto.toEntity();
        return service.update(id, property);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProperty(@PathVariable Long id) {
        service.delete(id);
    }
}
