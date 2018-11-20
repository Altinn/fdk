package no.ccat.service;

import com.google.common.collect.ImmutableMap;
import no.ccat.model.ConceptDenormalized;
import no.ccat.model.Definition;
import no.ccat.model.Source;
import no.dcat.shared.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ConceptBuilderService {
    static private final Logger logger = LoggerFactory.getLogger(ConceptBuilderService.class);

    private PublisherCatClient publisherCatClient;

    @Autowired
    public ConceptBuilderService(PublisherCatClient publisherCatClient) {
        this.publisherCatClient = publisherCatClient;
    }

    private static Publisher getFakePublisher(String id) {
        Publisher publisher = new Publisher();
        publisher.setOrgPath("/ba/be/bi/" + id);
        publisher.setId("idid");
        publisher.setPrefLabel(ImmutableMap.of("no", "norsk pub preflabel" + id, "en", "engelsk pub preflabel" + id));
        return publisher;
    }

    public ConceptDenormalized create(String id) {
        ConceptDenormalized concept = new ConceptDenormalized();
        concept.setId(id);
        concept.setUri("testuri" + id);
        concept.setHarvestSourceUri("testharvestsourceuri" + id);

        HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(null, new Date(), false);
        concept.setHarvest(harvest);
        Publisher publisher = lookupPublisher(id);
        if (publisher == null) {
            publisher = getFakePublisher(id);
        }
        concept.setPublisher(publisher);

        Definition definition = new Definition();
        
        definition.setText(ImmutableMap.of("no", "norsk definitin" + id, "en", "engelsk definition" + id));

        Source source = new Source();

        source.setUri("www.testuri.no");

        source.setPrefLabel(ImmutableMap.of("no", "norsk kildetekst", "en", "engelsk kildetekst"));

        definition.setSource(source);

        concept.setDefinition(definition);

        concept.setPrefLabel(ImmutableMap.of("no", "norsk preflabel" + id, "en", "engelsk preflabel" + id));

        return concept;
    }

    Publisher lookupPublisher(String orgNr) {
        try {
            return publisherCatClient.getByOrgNr(orgNr);
        } catch (Exception e) {
            logger.warn("Publisher lookup failed for orgNr={}. Error: {}", orgNr, e.getMessage());
        }
        return null;
    }
}
