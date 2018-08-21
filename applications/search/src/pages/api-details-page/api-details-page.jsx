import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DocumentMeta from 'react-document-meta';

import localization from '../../lib/localization';
import { getTranslateText } from '../../lib/translateText';
import { HarvestDate } from '../../components/harvest-date/harvest-date.component';
import { SearchHitHeader } from '../../components/search-hit-header/search-hit-header.component';
import { ApiEndpoints } from './api-endpoints/api-endpoints.component';
import { ShowMore } from '../../components/show-more/show-more';
import { StickyMenu } from '../../components/sticky-menu/sticky-menu.component';
import { SingleColGrid } from '../../components/singleColGrid/singleColGrid';
import { ListType1 } from '../../components/listType1/listType1';
import { TwoColRow } from '../../components/listType1/twoColRow/twoColRow';

const renderDescription = description => {
  if (!description) {
    return null;
  }

  const descriptionText = getTranslateText(description);
  return (
    <ShowMore
      showMoreButtonText={localization.showFullDescription}
      label={localization.description}
      contentHtml={descriptionText}
    />
  );
};

const renderFormats = formats => {
  if (!formats) {
    return null;
  }
  return <SingleColGrid title={localization.format} items={[formats]} />;
};

const renderApiEndpoints = paths => {
  if (!paths) {
    return null;
  }
  return (
    <ApiEndpoints name={localization.api.endpoints.response} paths={paths} />
  );
};

const renderDatasetReference = reference => {
  const uri = _.get(reference, ['source', 'uri']);
  const prefLabel = _.get(reference, ['source', 'prefLabel']);
  return (
    <React.Fragment key={uri}>
      <div className="mb-4">
        <a title={localization.api.linkDatasetReference} href={uri}>
          {prefLabel ? getTranslateText(prefLabel) : uri}
        </a>
      </div>
    </React.Fragment>
  );
};

const renderDatasetReferences = references => {
  if (!references) {
    return null;
  }
  const children = items => items.map(item => renderDatasetReference(item));

  return (
    <ListType1 title={localization.datasetReferences}>
      {children(references)}
    </ListType1>
  );
};

const renderContactPoint = contactPoint => (
  <React.Fragment key={contactPoint.uri}>
    {contactPoint.organizationName && (
      <React.Fragment>
        <TwoColRow
          col1={localization.contactPoint}
          col2={contactPoint.organizationName}
        />
        <hr />
      </React.Fragment>
    )}
    {contactPoint.email && (
      <React.Fragment>
        <TwoColRow col1={localization.email} col2={contactPoint.email} />
        <hr />
      </React.Fragment>
    )}
    {contactPoint.phone && (
      <React.Fragment>
        <TwoColRow col1={localization.phone} col2={contactPoint.phone} />
      </React.Fragment>
    )}
  </React.Fragment>
);

const renderContactPoints = contactPoints => {
  if (!contactPoints) {
    return null;
  }
  const children = items => items.map(item => renderContactPoint(item));

  return (
    <ListType1 title={localization.contactInfo}>
      {children(contactPoints)}
    </ListType1>
  );
};

const renderStickyMenu = apiItem => {
  const menuItems = [];
  if (_.get(apiItem, 'description')) {
    menuItems.push({
      name: localization.description,
      prefLabel: localization.description
    });
  }
  if (_.get(apiItem, 'formats')) {
    menuItems.push({
      name: localization.format,
      prefLabel: localization.format
    });
  }
  if (_.get(apiItem, ['openApi', 'paths'])) {
    menuItems.push({
      name: localization.api.endpoints.response,
      prefLabel: localization.api.endpoints.response
    });
  }
  if (_.get(apiItem, 'datasetReferences')) {
    menuItems.push({
      name: localization.datasetReferences,
      prefLabel: localization.datasetReferences
    });
  }
  if (_.get(apiItem, 'contactPoint')) {
    menuItems.push({
      name: localization.contactInfo,
      prefLabel: localization.contactInfo
    });
  }
  return <StickyMenu menuItems={menuItems} />;
};

export const ApiDetailsPage = props => {
  props.fetchPublishersIfNeeded();

  const { apiItem, publisherItems } = props;

  if (!apiItem) {
    return null;
  }

  const { title } = apiItem || {
    title: null
  };
  const { description } = apiItem || {
    description: null
  };

  const meta = {
    title: getTranslateText(title),
    description: getTranslateText(description)
  };

  return (
    <main id="content" className="container">
      <article>
        <div className="row">
          <div className="col-12 col-lg-8 offset-lg-4">
            <DocumentMeta {...meta} />
            <HarvestDate harvest={apiItem.harvest} />

            <SearchHitHeader
              title={getTranslateText(title)}
              publisherLabel={localization.api.provider}
              publisher={_.get(apiItem, 'publisher')}
              publisherItems={publisherItems}
              provenance={_.get(apiItem, 'provenance')}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-4 ">{renderStickyMenu(apiItem)}</div>

          <section className="col-12 col-lg-8 mt-3">
            {renderDescription(description)}

            {renderFormats(_.get(apiItem, 'formats'))}

            {renderApiEndpoints(_.get(apiItem, ['openApi', 'paths']))}

            {renderDatasetReferences(_.get(apiItem, 'datasetReferences'))}

            {renderContactPoints(_.get(apiItem, 'contactPoint'))}
          </section>
        </div>
      </article>
    </main>
  );
};

ApiDetailsPage.defaultProps = {
  apiItem: null,
  publisherItems: null,
  fetchPublishersIfNeeded: () => {}
};

ApiDetailsPage.propTypes = {
  apiItem: PropTypes.object,
  publisherItems: PropTypes.object,
  fetchPublishersIfNeeded: PropTypes.func
};
