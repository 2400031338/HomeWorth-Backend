package com.klu.service;

import com.klu.entity.Recommendation;
import com.klu.exception.ResourceNotFoundException;
import com.klu.repository.RecommendationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    private final RecommendationRepository repository;

    public RecommendationService(RecommendationRepository repository) {
        this.repository = repository;
    }

    public List<Recommendation> findAll() {
        return repository.findAll();
    }

    public Recommendation findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id " + id));
    }

    public Recommendation create(Recommendation recommendation) {
        return repository.save(recommendation);
    }

    public Recommendation update(Long id, Recommendation updated) {
        Recommendation existing = findById(id);
        existing.setTitle(updated.getTitle());
        existing.setCategory(updated.getCategory());
        existing.setRoi(updated.getRoi());
        existing.setCost(updated.getCost());
        existing.setDescription(updated.getDescription());
        existing.setFromAdmin(updated.isFromAdmin());
        existing.setTags(updated.getTags());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Recommendation recommendation = findById(id);
        repository.delete(recommendation);
    }
}
