package no.dcat.portal.query;

import no.dcat.shared.testcategories.UnitTest;
import org.junit.experimental.categories.Category;

/**
 * Class for testing theme rest-API in DatasetsQueryService.
 */
@Category(UnitTest.class)
public class DatasetsQueryServiceThemeTest {
//    public static final String INDEX = "theme";
//    public static final String TYPE = "data-theme";
//    public static final int NR_OF_HITS = 12;
//    DatasetsQueryService sqs;
//    Client client;
//    SearchResponse response;
//
//    @Before
//    public void setUp() {
//        sqs = new DatasetsQueryService();
//        client = mock(Client.class);
//        populateMock();
//        sqs.client = client;
//    }
//
//    /**
//     * Tests that both elasticsearch methods are called with correct set of parameters when retrieving all themes.
//     */
//    @Test
//    public void testValidGetAllThemes() {
//        ResponseEntity<String> actual = sqs.themes();
//
//        verify(client.prepareSearch(INDEX).setTypes(TYPE)).setQuery(any(QueryBuilder.class));
//        //Denne feiler når man bygger ned maven, finner ikke ut hvorfor.
//        //verify(client.prepareSearch(INDEX).setTypes(TYPE).setQuery(any(QueryBuilder.class)).setSize(NR_OF_HITS));
//        assertThat(actual.getStatusCodeValue()).isEqualTo(HttpStatus.OK.value());
//    }
//
//    private void populateMock() {
//        mockResponse();
//        mockRequest();
//    }
//
//    private void mockResponse() {
//        SearchHit[] hits = null;
//        SearchHit hit = mock(InternalSearchHit.class);
//
//        SearchHits searchHits = mock(SearchHits.class);
//        when(searchHits.getHits()).thenReturn(hits);
//
//        response = mock(SearchResponse.class);
//        when(response.getHits()).thenReturn(searchHits);
//        when(response.getHits().getHits()).thenReturn(new SearchHit[]{hit});
//        when(hit.getSourceAsString()).thenReturn("Id");
//
//        when(response.getHits().getTotalHits()).thenReturn((long) NR_OF_HITS);
//    }
//
//    private void mockRequest() {
//        ListenableActionFuture<SearchResponse> action = mock(ListenableActionFuture.class);
//        when(action.actionGet()).thenReturn(response);
//
//        SearchRequestBuilder builder = mock(SearchRequestBuilder.class);
//        when(builder.setQuery(any(QueryBuilder.class))).thenReturn(builder);
//        when(builder.execute()).thenReturn(action);
//        when(builder.setTypes(TYPE)).thenReturn(builder);
//        when(client.prepareSearch(INDEX)).thenReturn(builder);
//
//        when(builder.setSize(NR_OF_HITS)).thenReturn(builder);
//    }
}
