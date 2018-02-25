package com.urservices.ambassade.service;

import com.urservices.ambassade.domain.Passeport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Passeport.
 */
public interface PasseportService {

    /**
     * Save a passeport.
     *
     * @param passeport the entity to save
     * @return the persisted entity
     */
    Passeport save(Passeport passeport);

    /**
     * Get all the passeports.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Passeport> findAll(Pageable pageable);

    /**
     * Get the "id" passeport.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Passeport findOne(Long id);

    /**
     * Delete the "id" passeport.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}