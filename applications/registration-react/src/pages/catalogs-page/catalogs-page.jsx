import React from 'react';
import PropTypes from 'prop-types';
import { CardGroup } from 'reactstrap';
import _ from 'lodash';
import localization from '../../lib/localization';
import { Catalog } from './catalogs/catalog.component';
import { getTranslateText } from '../../lib/translateText';
import { selectorForCatalogDatasetsFromDatasetsState } from '../../redux/modules/datasets';
import { getAPIItemsCount } from '../../redux/modules/apis';
import './catalogs-page.scss';

const renderCatalogs = props => {
  const {
    catalogItems,
    datasetsState,
    apis,
    fetchDatasetsIfNeeded,
    fetchApisIfNeeded
  } = props;

  if (!catalogItems) {
    return null;
  }

  return catalogItems.map(catalog => (
    <div key={_.get(catalog, 'id')} className="row mb-2 mb-md-5">
      <div className="col-12">
        <div>
          <h2 className="fdk-text-strong mb-4">
            {getTranslateText(_.get(catalog, ['publisher', 'prefLabel'])) ||
              _.get(catalog, ['publisher', 'name'], '')}
          </h2>
        </div>
        <CardGroup>
          {datasetsState && (
            <Catalog
              key={`datasets-${catalog.id}`}
              catalogId={catalog.id}
              type="datasets"
              fetchItems={fetchDatasetsIfNeeded}
              itemsCount={
                Object.keys(
                  selectorForCatalogDatasetsFromDatasetsState(catalog.id)(
                    datasetsState
                  )
                ).length
              }
            />
          )}
          {apis && (
            <Catalog
              key={`apis-${catalog.id}`}
              catalogId={catalog.id}
              fetchItems={fetchApisIfNeeded}
              type="apis"
              itemsCount={getAPIItemsCount(apis, catalog.id)}
            />
          )}
          <Catalog
            key={`concepts-${catalog.id}`}
            catalogId={catalog.id}
            type="concepts"
          />
        </CardGroup>
      </div>
    </div>
  ));
};

export const RegCatalogs = props => {
  const { isFetching, catalogItems, fetchCatalogsIfNeeded } = props;
  fetchCatalogsIfNeeded();
  return (
    <div className="container">
      {catalogItems && renderCatalogs(props)}
      {!isFetching &&
        !catalogItems && (
          <div className="row mb-2 mb-md-5">
            <div id="no-catalogs">
              <h1 className="fdk-text-strong">
                {localization.catalogs.missingCatalogs.title}
              </h1>
              <div className="mt-2 mb-2">
                {localization.catalogs.missingCatalogs.ingress}
              </div>
              <div className="fdk-text-size-small">
                <strong>
                  {localization.catalogs.missingCatalogs.accessTitle}
                </strong>
                <p>
                  <a href="https://fellesdatakatalog.brreg.no/about-registration">
                    {localization.catalogs.missingCatalogs.accessText}
                    <i className="fa fa-external-link fdk-fa-right" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

RegCatalogs.defaultProps = {
  catalogItems: null,
  isFetching: false,
  fetchCatalogsIfNeeded: _.noop
};

RegCatalogs.propTypes = {
  catalogItems: PropTypes.array,
  isFetching: PropTypes.bool,
  fetchCatalogsIfNeeded: PropTypes.func
};
