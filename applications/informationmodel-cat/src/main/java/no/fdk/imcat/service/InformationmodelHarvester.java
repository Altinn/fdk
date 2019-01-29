package no.fdk.imcat.service;

import no.dcat.shared.HarvestMetadata;
import no.dcat.shared.HarvestMetadataUtil;
import no.dcat.shared.Publisher;
import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelHarvestSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/*
    Fetch information models and insert or update them in the search index.
 */
@Service
public class InformationmodelHarvester {

    public static final String API_TYPE = "api";
    public static final int RETRY_COUNT_API_RETRIEVAL = 20;

    private static final Logger logger = LoggerFactory.getLogger(InformationmodelHarvester.class);


    @Value("${application.harvestSourceUri}")
    private String harvestSourceUri;


    private InformationmodelRepository informationmodelRepository;
    private ApiRegistrationsHarvest apiRegistrationsHarvest;

    private PublisherCatClient publisherCatClient;

    @Autowired
    public InformationmodelHarvester(InformationmodelRepository repo, ApiRegistrationsHarvest apiRegistrationsHarvest, PublisherCatClient publisherCatClient) {
        this.informationmodelRepository = repo;
        this.apiRegistrationsHarvest = apiRegistrationsHarvest;
        this.publisherCatClient = publisherCatClient;
    }

    public void harvestAll() {

        logger.debug("Starting harvest of Information Models from our APIs");
        List<InformationModelHarvestSource> modelSources = getAllHarvestSources();

        Date harvestDate = new Date();

        for (InformationModelHarvestSource source : modelSources) {
            if (source.sourceType == API_TYPE) {

                Optional<InformationModel> existingModelOptional = informationmodelRepository.findById(source.id);

                InformationModel model = apiRegistrationsHarvest.getInformationModel(source);
                model.setPublisher(lookupPublisher(source.publisherOrgNr));

                updateHarvestMetadata(model, harvestDate, existingModelOptional.orElse(null));
                informationmodelRepository.save(model);
            }
        }
    }

    Publisher lookupPublisher(String orgNr) {
        try {
            return publisherCatClient.getByOrgNr(orgNr);
        } catch (Exception e) {
            logger.warn("Publisher lookup failed for orgNr={}. Error: {}", orgNr, e.getMessage());
        }
        return null;
    }

    void updateHarvestMetadata(InformationModel informationModel, Date harvestDate, InformationModel existingInformationModel) {
        HarvestMetadata oldHarvest = existingInformationModel != null ? existingInformationModel.getHarvest() : null;

        // new document is not considered a change
        boolean hasChanged = existingInformationModel != null && !isEqualContent(informationModel, existingInformationModel);

        HarvestMetadata harvest = HarvestMetadataUtil.createOrUpdate(oldHarvest, harvestDate, hasChanged);

        informationModel.setHarvest(harvest);
    }

    boolean isEqualContent(InformationModel first, InformationModel second) {
        String[] ignoredProperties = {"id", "harvest"};
        InformationModel firstContent = new InformationModel();
        InformationModel secondContent = new InformationModel();

        BeanUtils.copyProperties(first, firstContent, ignoredProperties);
        BeanUtils.copyProperties(second, secondContent, ignoredProperties);

        // This is a poor mans comparator. Seems to include all fields
        String firstString = firstContent.toString();
        String secondString = secondContent.toString();
        return firstString.equals(secondString);
    }

    private List<InformationModelHarvestSource> getAllHarvestSources() {
        //At the moment we only harvest our own apis.
        return apiRegistrationsHarvest.getHarvestSources();
    }


}
