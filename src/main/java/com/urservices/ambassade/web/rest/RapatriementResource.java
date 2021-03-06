package com.urservices.ambassade.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.urservices.ambassade.domain.Rapatriement;
import com.urservices.ambassade.domain.enumeration.Sexe;
import com.urservices.ambassade.service.RapatriementService;
import com.urservices.ambassade.web.rest.errors.BadRequestAlertException;
import com.urservices.ambassade.web.rest.util.HeaderUtil;
import com.urservices.ambassade.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Rapatriement.
 */
@RestController
@RequestMapping("/api")
public class RapatriementResource {

    private final Logger log = LoggerFactory.getLogger(RapatriementResource.class);

    private static final String ENTITY_NAME = "rapatriement";

    private final RapatriementService rapatriementService;

    public RapatriementResource(RapatriementService rapatriementService) {
        this.rapatriementService = rapatriementService;
    }

    /**
     * POST  /rapatriements : Create a new rapatriement.
     *
     * @param rapatriement the rapatriement to create
     * @return the ResponseEntity with status 201 (Created) and with body the new rapatriement, or with status 400 (Bad Request) if the rapatriement has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/rapatriements")
    @Timed
    public ResponseEntity<Rapatriement> createRapatriement(@Valid @RequestBody Rapatriement rapatriement) throws URISyntaxException {
        log.debug("REST request to save Rapatriement : {}", rapatriement);
        if (rapatriement.getId() != null) {
            throw new BadRequestAlertException("A new rapatriement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Rapatriement result = rapatriementService.save(rapatriement);
        return ResponseEntity.created(new URI("/api/rapatriements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /rapatriements : Updates an existing rapatriement.
     *
     * @param rapatriement the rapatriement to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated rapatriement,
     * or with status 400 (Bad Request) if the rapatriement is not valid,
     * or with status 500 (Internal Server Error) if the rapatriement couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/rapatriements")
    @Timed
    public ResponseEntity<Rapatriement> updateRapatriement(@Valid @RequestBody Rapatriement rapatriement) throws URISyntaxException {
        log.debug("REST request to update Rapatriement : {}", rapatriement);
        if (rapatriement.getId() == null) {
            return createRapatriement(rapatriement);
        }
        Rapatriement result = rapatriementService.save(rapatriement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, rapatriement.getId().toString()))
            .body(result);
    }

    /**
     * GET  /rapatriements : get all the rapatriements.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of rapatriements in body
     */
    @GetMapping("/rapatriements")
    @Timed
    public ResponseEntity<List<Rapatriement>> getAllRapatriements(WebRequest webRequest, Pageable pageable) {

        log.debug("REST request to get a page of Rapatriements");

        String reference = webRequest.getParameter("reference") !=null && !webRequest.getParameter("reference").isEmpty()
            ? (webRequest.getParameter("reference")): null;
        String numeroDossier = webRequest.getParameter("numeroDossier") !=null && !webRequest.getParameter("numeroDossier").isEmpty()
            ? webRequest.getParameter("numeroDossier"): null;
        String nom = webRequest.getParameter("nom") !=null && !webRequest.getParameter("nom").isEmpty()
            ? webRequest.getParameter("nom"): null;
        String prenom = webRequest.getParameter("prenom") !=null && !webRequest.getParameter("prenom").isEmpty()
            ? webRequest.getParameter("prenom"): null;
        String documentID = webRequest.getParameter("documentID") !=null && !webRequest.getParameter("documentID").isEmpty()
            ? webRequest.getParameter("documentID"): null;
        Sexe sexe = webRequest.getParameter("sexe") !=null && !webRequest.getParameter("sexe").isEmpty() ?
            Sexe.valueOf(webRequest.getParameter("sexe")) : null;
        String motif = webRequest.getParameter("motif") !=null && !webRequest.getParameter("motif").isEmpty()
            ? webRequest.getParameter("motif"): null;
        String frontiere = webRequest.getParameter("frontiere") !=null && !webRequest.getParameter("frontiere").isEmpty()
            ? webRequest.getParameter("frontiere"): null;

        String dateNaissanceDebStr = webRequest.getParameter("dateNaissanceDeb") !=null &&
            !webRequest.getParameter("dateNaissance").isEmpty()? webRequest.getParameter("dateNaissance"):  null;
        String dateNaissanceFinStr = webRequest.getParameter("dateNaissanceFin") !=null &&
            !webRequest.getParameter("dateNaissanceFin").isEmpty() ?
            webRequest.getParameter("dateNaissanceFin"):  null;
        String dateRapatriementDebStr = webRequest.getParameter("dateRapatriement") !=null &&
            !webRequest.getParameter("dateRapatriement").isEmpty() ? webRequest.getParameter("dateRapatriement"):  null;
        String dateRapatriementFinStr= webRequest.getParameter("dateRapatriementFin") !=null &&
            !webRequest.getParameter("dateRapatriementFin").isEmpty() ?
            webRequest.getParameter("dateRapatriementFin") :  null;

        LocalDate dateNaissanceDeb = null;
        LocalDate dateNaissanceFin = null;
        LocalDate dateRapatriementDeb = null;
        LocalDate dateRapatriementFin = null;

        if (dateNaissanceDebStr != null){
            dateNaissanceDeb = LocalDate.parse(dateNaissanceDebStr);
        }
        if (dateNaissanceFinStr != null){
            dateNaissanceFin = LocalDate.parse(dateNaissanceFinStr);
        }

        if (dateRapatriementDebStr != null){
            dateRapatriementDeb = LocalDate.parse(dateRapatriementDebStr);
        }
        if (dateRapatriementFinStr != null){
            dateRapatriementFin = LocalDate.parse(dateRapatriementFinStr);
        }

        Page<Rapatriement> page = rapatriementService.searchAll(reference,numeroDossier,nom,prenom,dateNaissanceDeb,
            dateNaissanceFin, sexe,motif,dateRapatriementDeb, dateRapatriementFin, frontiere,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/rapatriements");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /rapatriements/:id : get the "id" rapatriement.
     *
     * @param id the id of the rapatriement to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the rapatriement, or with status 404 (Not Found)
     */
    @GetMapping("/rapatriements/{id}")
    @Timed
    public ResponseEntity<Rapatriement> getRapatriement(@PathVariable Long id) {
        log.debug("REST request to get Rapatriement : {}", id);
        Rapatriement rapatriement = rapatriementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(rapatriement));
    }

    /**
     * DELETE  /rapatriements/:id : delete the "id" rapatriement.
     *
     * @param id the id of the rapatriement to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/rapatriements/{id}")
    @Timed
    public ResponseEntity<Void> deleteRapatriement(@PathVariable Long id) {
        log.debug("REST request to delete Rapatriement : {}", id);
        rapatriementService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
