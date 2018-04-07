package com.urservices.ambassade.service.impl;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.urservices.ambassade.domain.QPasseport;
import com.urservices.ambassade.domain.enumeration.Statut;
import com.urservices.ambassade.service.PasseportService;
import com.urservices.ambassade.domain.Passeport;
import com.urservices.ambassade.repository.PasseportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;


/**
 * Service Implementation for managing Passeport.
 */
@Service
@Transactional
public class PasseportServiceImpl implements PasseportService {

    private final Logger log = LoggerFactory.getLogger(PasseportServiceImpl.class);

    private final PasseportRepository passeportRepository;

    public PasseportServiceImpl(PasseportRepository passeportRepository) {
        this.passeportRepository = passeportRepository;
    }

    /**
     * Save a passeport.
     *
     * @param passeport the entity to save
     * @return the persisted entity
     */
    @Override
    public Passeport save(Passeport passeport) {
        log.debug("Request to save Passeport : {}", passeport);
        return passeportRepository.save(passeport);
    }

    /**
     * Get all the passeports.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Passeport> findAll(Pageable pageable) {
        log.debug("Request to get all Passeports");
        return passeportRepository.findAll(pageable);
    }

    /**
     * Get one passeport by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Passeport findOne(Long id) {
        log.debug("Request to get Passeport : {}", id);
        return passeportRepository.findOne(id);
    }

    /**
     * Delete the passeport by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Passeport : {}", id);
        passeportRepository.delete(id);
    }

    @Override
    public Page<Passeport> searchAll(String nom, String prenom, String numeroPasseport, LocalDate neLeDeb, LocalDate neLeFin,
                                     String lieuNaissance, Statut etatCivil, String adresse,
                                     String paysEmetteur, LocalDate soumisLeDeb, LocalDate soumisLeFin,
                                     LocalDate delivreLeDeb, LocalDate delivreLeFin, BigDecimal montant,
                                     LocalDate dateEmissionDeb, LocalDate dateEmissionFin, LocalDate dateExpirationDeb,
                                     LocalDate dateExpirationFin, String documents, Pageable pageable) {
        QPasseport passeport = QPasseport.passeport;
        BooleanExpression predicate = null;
        boolean added = true;
        if (nom != null) {
            predicate = passeport.nom.likeIgnoreCase("%" + nom + "%");
            added = true;
        }
        if (prenom != null) {
            if (added) {
                predicate = predicate.and(passeport.prenom.likeIgnoreCase("%" + prenom + "%"));
            } else {
                predicate = passeport.prenom.likeIgnoreCase("%" + prenom + "%");
                added = true;
            }
        }
        if (numeroPasseport != null) {
            if (added) {
                predicate = predicate.and(passeport.numeroPasseport.likeIgnoreCase("%" + numeroPasseport + "%"));
            } else {
                predicate = passeport.numeroPasseport.likeIgnoreCase("%" + numeroPasseport + "%");
                added = true;
            }
        }
        if (lieuNaissance != null) {
            if (added) {
                predicate = predicate.and(passeport.lieuNaissance.likeIgnoreCase("%" + lieuNaissance + "%"));
            } else {
                predicate = passeport.lieuNaissance.likeIgnoreCase("%" + lieuNaissance + "%");
                added = true;
            }
        }
        if (etatCivil != null) {
            if (added) {
                predicate = predicate.and(passeport.etatCivil.eq(etatCivil));
            } else {
                predicate = passeport.etatCivil.eq(etatCivil);
                added = true;
            }
        }
        if (adresse != null) {
            if (added) {
                predicate = predicate.and(passeport.adresse.likeIgnoreCase("%" + adresse + "%"));
            } else {
                predicate = passeport.adresse.likeIgnoreCase("%" + adresse + "%");
                added = true;
            }
        }
        if (paysEmetteur != null) {
            if (added) {
                predicate = predicate.and(passeport.paysEmetteur.likeIgnoreCase("%" + paysEmetteur + "%"));
            } else {
                predicate = passeport.paysEmetteur.likeIgnoreCase("%" + paysEmetteur + "%");
                added = true;
            }
        }
        if (documents != null) {
            if (added) {
                predicate = predicate.and(passeport.documents.likeIgnoreCase("%" + documents + "%"));
            } else {
                predicate = passeport.documents.likeIgnoreCase("%" + documents + "%");
                added = true;
            }
        }
        if (montant != null) {
            if (added) {
                predicate = predicate.and(passeport.montant.goe(montant));
            } else {
                predicate = passeport.montant.goe(montant);
                added = true;
            }
        }
        if (neLeDeb != null) {
            if (added) {
                if (neLeFin != null) {
                    predicate = predicate.and(passeport.neLe.between(neLeDeb, neLeFin));
                } else {
                    predicate = predicate.and(passeport.neLe.goe(neLeDeb));
                }
            } else {
                if (neLeFin != null) {
                    predicate = passeport.neLe.between(neLeDeb, neLeFin);
                } else {
                    predicate = passeport.neLe.goe(neLeDeb);
                }
                added = true;
            }
        }
        if (soumisLeDeb != null) {
            if (added) {
                if (soumisLeFin != null) {
                    predicate = predicate.and(passeport.soumisLe.between(soumisLeDeb, soumisLeFin));
                } else {
                    predicate = predicate.and(passeport.soumisLe.goe(soumisLeDeb));
                }
            } else {
                if (soumisLeFin != null) {
                    predicate = passeport.soumisLe.between(soumisLeDeb, soumisLeFin);
                } else {
                    predicate = passeport.soumisLe.goe(soumisLeDeb);
                }
                added = true;
            }
        }
        if (delivreLeDeb != null) {
            if (added) {
                if (delivreLeFin != null) {
                    predicate = predicate.and(passeport.delivreLe.between(delivreLeDeb, delivreLeFin));
                } else {
                    predicate = predicate.and(passeport.delivreLe.goe(delivreLeDeb));
                }
            } else {
                if (delivreLeFin != null) {
                    predicate = passeport.delivreLe.between(delivreLeDeb, delivreLeFin);
                } else {
                    predicate = passeport.delivreLe.goe(delivreLeDeb);
                }
                added = true;
            }
        }
        if (dateEmissionDeb != null) {
            if (added) {
                if (dateEmissionFin != null) {
                    predicate = predicate.and(passeport.dateEmission.between(dateEmissionDeb, dateEmissionFin));
                } else {
                    predicate = predicate.and(passeport.dateEmission.goe(dateEmissionDeb));
                }
            } else {
                if (soumisLeFin != null) {
                    predicate = passeport.dateEmission.between(dateEmissionDeb, dateEmissionFin);
                } else {
                    predicate = passeport.dateEmission.goe(dateEmissionDeb);
                }
                added = true;
            }
        }
        if (dateExpirationDeb != null) {
            if (added) {
                if (dateExpirationFin != null) {
                    predicate = predicate.and(passeport.dateExpiration.between(dateExpirationDeb, dateExpirationFin));
                } else {
                    predicate = predicate.and(passeport.dateExpiration.goe(dateExpirationDeb));
                }
            } else {
                if (soumisLeFin != null) {
                    predicate = passeport.dateExpiration.between(dateExpirationDeb, dateExpirationFin);
                } else {
                    predicate = passeport.dateExpiration.goe(dateExpirationDeb);
                }
                added = true;
            }
        }
        if (predicate != null) {
            return passeportRepository.findAll(predicate, pageable);
        } else {
            return passeportRepository.findAll(pageable);
        }
    }
}
