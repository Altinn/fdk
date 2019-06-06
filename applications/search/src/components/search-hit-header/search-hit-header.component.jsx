import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { LabelNational } from '../label-national/label-national.component';
import { LabelStatus } from '../label-status/label-status.component';
import { PublisherLabel } from '../publisher-label/publisher-label.component';
import { getPublisherByOrgNr } from '../../redux/modules/publishers';
import { REFERENCEDATA_LOS } from '../../redux/modules/referenceData';
import { getTranslateText } from '../../lib/translateText';
import localization from '../../lib/localization';
import './search-hit-header.scss';

const renderPublisher = (publisherLabel, publisher, publisherItems) => {
  if (!publisher) {
    return null;
  }
  const publisherItem =
    getPublisherByOrgNr(publisherItems, _.get(publisher, 'id')) || publisher;
  return (
    <PublisherLabel label={publisherLabel} publisherItem={publisherItem} />
  );
};

const renderThemes = (theme, losItems) => {
  let themeNodes;
  if (theme) {
    themeNodes = theme.map((singleTheme, index) => {
      const losItem = _.find(losItems, { uri: singleTheme.id });
      return (
        <div
          key={`dataset-description-theme-${index}`}
          className="fdk-label mr-2 mb-2"
        >
          <span className="uu-invisible" aria-hidden="false">
            Datasettets tema.
          </span>
          {getTranslateText(
            _.get(losItem, 'prefLabel') ||
              _.get(losItem, 'name') ||
              singleTheme.title
          )}
        </div>
      );
    });
  }
  return themeNodes;
};

const renderTitle = (Tag, title, titleLink) => {
  const titleTag = (Tag, title) => (
    <Tag className="mr-3" name={title}>
      {title}
    </Tag>
  );
  if (titleLink) {
    return (
      <Link
        className="search-hit__title-link"
        title={`${localization.apiLabel}: ${title}`}
        to={titleLink}
      >
        {titleTag(Tag, title)}
      </Link>
    );
  }
  return titleTag(Tag, title);
};

export const SearchHitHeader = props => {
  const {
    tag: Tag,
    title,
    titleLink,
    publisherLabel,
    publisher,
    publisherTag,
    publisherItems,
    theme,
    nationalComponent,
    statusCode,
    referenceData
  } = props;

  return (
    <>
      {title && (
        <div className="mb-2 d-flex flex-wrap align-items-center">
          {renderTitle(Tag, title, titleLink)}
          {statusCode && (
            <LabelStatus
              statusCode={statusCode}
              referenceData={referenceData}
            />
          )}
          {nationalComponent && (
            <div className="ml-auto">
              <LabelNational />
            </div>
          )}
        </div>
      )}

      <div className="mb-4 d-flex flex-wrap align-items-baseline">
        {publisherItems &&
          renderPublisher(publisherLabel, publisher, publisherItems)}

        {!publisherItems &&
          publisher && (
            <PublisherLabel
              tag={publisherTag}
              label={publisherLabel}
              publisherItem={publisher}
            />
          )}

        {theme &&
          renderThemes(
            theme,
            _.get(referenceData, ['items', REFERENCEDATA_LOS])
          )}
      </div>
    </>
  );
};

SearchHitHeader.defaultProps = {
  tag: 'h1',
  title: null,
  titleLink: null,
  publisherLabel: null,
  publisher: null,
  publisherTag: 'span',
  publisherItems: null,
  theme: null,
  nationalComponent: false,
  statusCode: null,
  referenceData: null
};

SearchHitHeader.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string,
  titleLink: PropTypes.string,
  publisherLabel: PropTypes.string,
  publisher: PropTypes.object,
  publisherTag: PropTypes.string,
  publisherItems: PropTypes.object,
  theme: PropTypes.array,
  nationalComponent: PropTypes.bool,
  statusCode: PropTypes.string,
  referenceData: PropTypes.object
};
