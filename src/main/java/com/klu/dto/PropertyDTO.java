package com.klu.dto;

import com.klu.entity.Property;
import jakarta.validation.constraints.NotBlank;

public class PropertyDTO {

    @NotBlank(message = "Property type is required")
    private String type;

    @NotBlank(message = "City is required")
    private String city;

    private String area;
    private String size;
    private String age;
    private String budget;
    private String issues;
    private String location;
    private String image;
    private String status;
    private String adminNote;
    private Long userId;
    private String userName;
    private String submittedAt;

    public PropertyDTO() {
    }

    public Property toEntity() {
        Property property = new Property();
        property.setType(this.type);
        property.setCity(this.city);
        property.setArea(this.area);
        property.setSize(this.size);
        property.setAge(this.age);
        property.setBudget(this.budget);
        property.setIssues(this.issues);
        property.setLocation(this.location);
        property.setImage(this.image);
        property.setStatus(this.status);
        property.setAdminNote(this.adminNote);
        property.setOwnerId(this.userId);
        property.setUserName(this.userName);
        property.setSubmittedAt(this.submittedAt);
        return property;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getIssues() {
        return issues;
    }

    public void setIssues(String issues) {
        this.issues = issues;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }
}
