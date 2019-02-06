package no.fdk.registration.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;
import no.fdk.acat.common.model.apispecification.ApiSpecification;

import java.util.List;

@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRegistrationPublic {

    private String id;

    @ApiModelProperty("Catalog id is equal to orgNr")
    private String catalogId;

    @ApiModelProperty("The url of the specification which are used to harvest the specification ")
    private String apiSpecUrl;

    @ApiModelProperty("Original API spec")
    private String apiSpec;

    @ApiModelProperty("The url of the API documentation")
    private String apiDocUrl;

    @ApiModelProperty("Indication if the api is a National Component")
    private boolean nationalComponent;

    @ApiModelProperty("The dataset references")
    private List<String> datasetReferences;

    private ApiSpecification apiSpecification;

    private String cost;

    private String usageLimitation;

    private String performance;

    private String availability;
}