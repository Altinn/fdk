package no.fdk.imcat.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.shared.Publisher;
import no.fdk.imcat.model.InformationModel;
import no.fdk.imcat.model.InformationModelFactory;
import no.fdk.imcat.model.InformationModelHarvestSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.zip.GZIPInputStream;

/**
 * Harvest Altinns APIS
 */

@Service
public class AltinnHarvest {
    private static final Logger logger = LoggerFactory.getLogger(AltinnHarvest.class);
    private static String harvestSourceURIBase = "https://fdk-dev-altinn.appspot.com/api/v1/schemas/";
    private InformationModelFactory informationModelFactory;
    private HashMap<String, InformationModel> everyAltinnInformationModel = new HashMap<>();


    public AltinnHarvest(InformationModelFactory factory) {
        this.informationModelFactory = factory;
    }

    private static InformationModel parseInformationModel(AltInnService service) {
        InformationModel model = new InformationModel();

        Publisher p = new Publisher(service.OrganizationNumber);
        model.setPublisher(p);
        model.setTitle(service.ServiceName);
        model.setHarvestSourceUri(harvestSourceURIBase + service.ServiceCode + "_" + service.ServiceEditionCode);

        StringBuilder formBuilder = new StringBuilder();

        for (AltinnForm form : service.Forms) {
            byte[] gzippedJson = Base64.getDecoder().decode(form.JsonSchema);
            formBuilder.append(extractSingleForm(gzippedJson));
        }
        model.setSchema(formBuilder.toString());
        return model;
    }

    private static String extractSingleForm(byte[] gzippedJson) {
        try (ByteArrayInputStream bin = new ByteArrayInputStream(gzippedJson);
             GZIPInputStream gzipper = new GZIPInputStream(bin)) {
            ByteArrayOutputStream myBucket = new ByteArrayOutputStream();
            boolean done = false;
            byte[] buffer = new byte[10000];
            while (!done) {
                int length = gzipper.read(buffer, 0, buffer.length);
                if (length > 0) {
                    myBucket.write(buffer, 0, length);
                }
                done = (length == -1);
            }
            gzipper.close();

            return new String(myBucket.toByteArray(), StandardCharsets.UTF_8);
        } catch (IOException ie) {
            logger.debug("Failed to gunzip JSON", ie);
        }
        return null;
    }

    public InformationModel getByServiceCodeAndEdition(String serviceCode, String serviceEditionCode) {
        return everyAltinnInformationModel.get(serviceCode + "_" + serviceEditionCode);
    }

    public List<InformationModelHarvestSource> getHarvestSources() {
        logger.debug("Getting harvest sources from AltInn");
        List<InformationModelHarvestSource> sourceList = new ArrayList<>();

        loadAllInformationModelsFromOurAltInnAdapter();

        for (String key : everyAltinnInformationModel.keySet()) {

            InformationModel model = everyAltinnInformationModel.get(key);

            int underscoreIndex = key.indexOf("_");
            String altInnServiceCode = key.substring(0, underscoreIndex);
            String altInnServiceEditionCode = key.substring(underscoreIndex + 1);

            InformationModelHarvestSource source = new InformationModelHarvestSource();
            source.harvestSourceUri = model.getHarvestSourceUri();
            source.sourceType = InformationmodelHarvester.ALTINN_TYPE;

            source.serviceCode = altInnServiceCode;
            source.serviceEditionCode = altInnServiceEditionCode;
            sourceList.add(source);
        }
        return sourceList;
    }

    private void loadAllInformationModelsFromOurAltInnAdapter() {
        try {
            URL altinn = new URL("https://fdk-dev-altinn.appspot.com/api/v1/schemas");
            logger.debug("Retrieving all schemas from altinn.  url: {} expected load time approx 5 minutes", altinn);
            ObjectMapper objectMapper = new ObjectMapper();
            List<AltInnService> servicesInAltInn = objectMapper.readValue(altinn, new TypeReference<List<AltInnService>>() {
            });
            logger.debug("Done retrieving all schemas from altinn. {} ", altinn);

            //Now extract the subforms from base64 gzipped json
            for (AltInnService service : servicesInAltInn) {
                InformationModel model = parseInformationModel(service);
                everyAltinnInformationModel.put(model.getHarvestSourceUri(), model);
            }
        } catch (Throwable e) {
            logger.debug("Failed while reading information models from  ", e);
        }
    }

    private static class AltInnService {

        public String ServiceOwnerCode;
        public String ServiceOwnerName;
        public String OrganizationNumber;
        public String ServiceName;
        public String ServiceCode;
        public String ServiceEditionCode;
        public String ValidFrom;
        public String ValidTo;
        public String ServiceType;
        public String EnterpriseUserEnabled;
        public List<AltinnForm> Forms;

        AltInnService() {
        }
    }

    private static class AltinnForm {
        public String FormID;
        public String FormName;
        public String FormType;
        public String DataFormatID;
        public String DataFormatVersion;
        public String XsdSchemaUrl;
        public String JsonSchema;
    }

}
