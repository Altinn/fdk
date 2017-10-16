package no.dcat.controller;

import no.dcat.model.Catalog;
import no.dcat.model.Dataset;
import no.dcat.service.CatalogRepository;
import no.dcat.service.DatasetRepository;
import no.difi.dcat.datastore.domain.dcat.data.CompleteCatalog;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.BeanUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.anyObject;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.when;

/**
 * Created by dask on 21.04.2017.
 */

public class RdfCatalogControllerTest {

    private RdfCatalogController controller;
    private Catalog catalog;

    @Mock
    private DatasetRepository mockDR;

    @Mock
    private CatalogRepository mockCR;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        catalog = new Catalog();
        BeanUtils.copyProperties(CompleteCatalog.getCompleteCatalog(), catalog);

        when(mockCR.findOne(anyString())).thenReturn((no.dcat.model.Catalog) catalog);

        //when(controller.getCatalogRepository()).thenReturn(mockCR);
        controller = new RdfCatalogController(mockCR, mockDR);

    }

    @Test
    public void getDcatRepOK() throws Throwable {
        String catalogId = catalog.getId();

        Page<Dataset> pagedDataset = new Page<Dataset>() {
            @Override
            public int getTotalPages() {
                return 0;
            }

            @Override
            public long getTotalElements() {
                return 0;
            }

            @Override
            public <S> Page<S> map(Converter<? super Dataset, ? extends S> converter) {
                return null;
            }

            @Override
            public int getNumber() {
                return 0;
            }

            @Override
            public int getSize() {
                return 0;
            }

            @Override
            public int getNumberOfElements() {
                return 0;
            }

            @Override
            public List<Dataset> getContent() {
                List<Dataset> ds = new ArrayList<>();
                catalog.getDataset().forEach(d -> {
                    ds.add((Dataset) d);
                });
                return ds;
            }

            @Override
            public boolean hasContent() {
                return false;
            }

            @Override
            public Sort getSort() {
                return null;
            }

            @Override
            public boolean isFirst() {
                return false;
            }

            @Override
            public boolean isLast() {
                return false;
            }

            @Override
            public boolean hasNext() {
                return false;
            }

            @Override
            public boolean hasPrevious() {
                return false;
            }

            @Override
            public Pageable nextPageable() {
                return null;
            }

            @Override
            public Pageable previousPageable() {
                return null;
            }

            @Override
            public Iterator<Dataset> iterator() {
                return null;
            }
        };

        when(mockDR.findByCatalogId(anyString(), (Pageable) anyObject())).thenReturn(pagedDataset);

        HttpEntity<Catalog> actualEntity = controller.getCatalog(catalogId);

        Catalog actual = actualEntity.getBody();
        assertThat(actual.getId(), is(catalogId));

    }
}
