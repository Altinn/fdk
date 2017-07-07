package no.dcat.bddtest.cucumber;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

/**
 * Class for starting cucumbertest for Publisher page.
 */
@RunWith(Cucumber.class)
@CucumberOptions(
        format = { "pretty", "html:target/cucumber" },
        features = {"classpath:feature/HarvestDIFIData.feature", "classpath:feature/onlyImportValidDatasets.feature"},
        tags = {"~@ignore"}
)
public class HarvestTests {
}
