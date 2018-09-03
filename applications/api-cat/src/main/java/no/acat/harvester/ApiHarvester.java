package no.acat.harvester;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.config.Utils;
import no.acat.model.ApiCatalogRecord;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import no.acat.service.ReferenceDataService;
import no.dcat.shared.client.referenceData.ReferenceDataClient;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

@Service
public class ApiHarvester {
    private static final Logger logger = LoggerFactory.getLogger(ApiHarvester.class);

    private Client elasticsearchClient;
    private ReferenceDataClient referenceDataClient;
    private ObjectMapper mapper = Utils.jsonMapper();

    @Autowired
    public ApiHarvester(ElasticsearchService elasticsearchService, ReferenceDataService referenceDataService) {
        this.elasticsearchClient = elasticsearchService.getClient();
        this.referenceDataClient = referenceDataService.getClient();
    }

    @PostConstruct
    public List<ApiDocument> harvestAll() {
        List<ApiDocument> result = new ArrayList<>();

        List<ApiCatalogRecord> apiCatalog = getApiCatalog();
        ApiDocumentBuilder apiDocumentBuilder = createApiDocumentBuilder();

        for (ApiCatalogRecord apiCatalogRecord : apiCatalog) {
            try {

                ApiDocument apiDocument = apiDocumentBuilder.create(apiCatalogRecord);
                indexApi(apiDocument);
                result.add(apiDocument);
            } catch (Exception e) {
                logger.error(e.getMessage());
            }

        }
        return result;
    }


    ApiDocumentBuilder createApiDocumentBuilder() {
        return new ApiDocumentBuilder(elasticsearchClient, referenceDataClient);
    }

    void indexApi(ApiDocument document) throws JsonProcessingException {
        BulkRequestBuilder bulkRequest = elasticsearchClient.prepareBulk();
        String id = document.getId();
        IndexRequest request = new IndexRequest("acat", "apispec", id);

        String json = mapper.writeValueAsString(document);
        request.source(json);
        bulkRequest.add(request);

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed index of %s. Reason %s", id, bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }
    }

    List<ApiCatalogRecord> getApiCatalog() {
        org.springframework.core.io.Resource apiCatalogCsvFile = new ClassPathResource("apis.csv");
        List<ApiCatalogRecord> result = new ArrayList<>();

        String[] apiFiles = {"enhetsreg-static.json", "seres-api.json"};

        for (String apiFileName : apiFiles) {
            ApiCatalogRecord catalogRecord = new ApiCatalogRecord();
            catalogRecord.setOrgNr("974760673");
            ClassPathResource classPathResource = new ClassPathResource(apiFileName);
            try {
                catalogRecord.setOpenApiUrl(classPathResource.getURL().toString());
            } catch (Exception e) {
                logger.error("Unable get resource url", e.getMessage(), e);
            }
            result.add(catalogRecord);
        }

        Iterable<CSVRecord> records;

        try (
                Reader input =
                        new BufferedReader(new InputStreamReader(apiCatalogCsvFile.getInputStream()))
        ) {
            records = CSVFormat.EXCEL.withHeader().withDelimiter(';').parse(input);

            for (CSVRecord line : records) {
                ApiCatalogRecord catalogRecord = new ApiCatalogRecord();
                catalogRecord.setOrgNr(line.get("OrgNr"));
                catalogRecord.setOpenApiUrl(line.get("OpenApiUrl"));
                catalogRecord.setAccessRightsCodes(Arrays.asList(line.get("AccessRights").split(",")));
                catalogRecord.setProvenanceCode(line.get("Provenance"));
                catalogRecord.setDatasetReferences(Arrays.asList(line.get("DatasetRefs").split(",")));
                result.add(catalogRecord);
            }

            logger.info("Read {} api catalog records.", result.size());

        } catch (
                IOException e) {
            logger.error("Could not read api catalog records: {}", e.getMessage());
        }
        return result;
    }


}
