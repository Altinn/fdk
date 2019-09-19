import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import localization from '../../lib/localization';
import { FormTemplateWithState } from '../../components/form-template/form-template-with-state.component';
import { ConnectedFormTitle } from './form-title/connected-form-title.component';
import { FormDistribution } from './form-distribution/form-distribution';
import { ConnectedFormSample } from './form-sample/connected-form-sample.component';
import { ConnectedFormSpatial } from './form-spatial/connected-form-spatial.component';
import { ConnectedFormProvenance } from './form-provenance/connected-form-provenance.component';
import { ConnectedFormThemes } from './form-theme/connected-form-theme.component';
import { ConnectedFormType } from './form-type/connected-form-type.component';
import { ConnectedFormConcept } from './form-concept/connected-form-concept.component';
import { ConnectedFormAccessRights } from './form-accessRights/connected-form-accessRights.component';
import { ConnectedFormReference } from './form-reference/connected-form-reference.component';
import { ConnectedFormInformationModel } from './form-informationmodel/connected-form-informationmodel.component';
import { ConnectedFormContactPoint } from './form-contactPoint/connected-form-contactPoint.component';
import { ConnectedFormContents } from './form-contents/connected-form-contents.component';
import { StatusBar } from '../../components/status-bar/status-bar.component';
import { ConnectedFormPublish } from './connected-form-publish/connected-form-publish';
import { FormDistributionApi } from './form-distribution-api/form-distribution-api';
import { ConnectedFormLOS } from './form-los/connected-form-los.component';
import LanguagePicker from '../../components/language-picker/language-picker.component';
import {
  accessRightsValues,
  conceptValues,
  contactPointValues,
  contentsValues,
  distributionAPIValues,
  distributionValues,
  informationModelValues,
  losValues,
  provenanceValues,
  referenceValues,
  sampleValues,
  spatialValues,
  themesValues,
  titleValues,
  typeValues
} from './dataset-registration-page.logic';
import './dataset-registration-page.scss';

// check the validation state of all rendered forms
const isAllowedToPublish = form =>
  !_.some(_.mapValues(form, subform => subform.syncErrors));

async function deleteAndNavigateToList({
  history,
  catalogId,
  datasetId,
  dispatchDeleteDataset
}) {
  await dispatchDeleteDataset(catalogId, datasetId);
  if (history) {
    history.push({
      pathname: `/catalogs/${catalogId}/datasets`,
      state: { confirmDelete: true }
    });
  }
}

export function DatasetRegistrationPagePure(props) {
  const {
    dispatchEnsureData,
    form,
    themesItems,
    provenanceItems,
    frequencyItems,
    datasetItem,
    referenceTypesItems,
    referenceDatasetsItems,
    openLicenseItems,
    datasetFormStatus,
    catalogId,
    datasetId,
    losItems,
    history,
    dispatchDeleteDataset,
    languages,
    setInputLanguages,
    toggleInputLanguage
  } = props;

  const {
    title = {},
    accessRights = {},
    themes = {},
    type = {},
    concept = {},
    spatial = {},
    formProvenance = {},
    contents = {},
    informationModel = {},
    reference = {},
    contactPoint = {},
    distribution = {},
    sample = {}
  } =
    form || {};

  useEffect(() => dispatchEnsureData(catalogId, datasetId), [
    catalogId,
    datasetId
  ]);

  const [languagesDetermined, setLanguagesDetermined] = useState(false);

  const translatableFields = ['title', 'description'];

  const parseDataset = doc => {
    if (Array.isArray(doc)) {
      return doc.map(parseDataset).flat();
    }

    return typeof doc === 'object'
      ? Object.entries(doc).reduce(
          (previous, [key]) =>
            previous.concat(
              translatableFields.includes(key)
                ? Object.keys(doc[key])
                : parseDataset(doc[key])
            ),
          []
        )
      : [];

    // if (typeof doc === 'object') {
    //   // const t = Object.keys(doc).filter(key => {
    //   //   return translatableFields.includes(key);
    //   // });
    //   // console.log(t);
    //   // debugger;

    //   languagesUsed = languagesUsed.concat(
    //     Object.entries(doc).reduce((previous, [key]) => {
    //       return previous.concat(
    //         translatableFields.includes(key)
    //           ? Object.keys(doc[key])
    //           : parseDataset(doc[key])
    //       );
    //     }, [])
    //   );

    //   // WORKS!!
    //   // Object.entries(doc).forEach(([key]) => {
    //   //   languagesUsed = languagesUsed.concat(
    //   //     translatableFields.includes(key)
    //   //       ? Object.keys(doc[key])
    //   //       : parseDataset(doc[key])
    //   //   );
    //   // });
    // }

    // languagesUsed = languagesUsed.concat(something);

    // return languagesUsed;
  };

  const getUsedLanguages = () => {
    return datasetItem ? [...new Set(parseDataset(datasetItem))] : [];
  };

  useEffect(
    () => {
      if (datasetItem && !languagesDetermined) {
        setInputLanguages(getUsedLanguages());
        setLanguagesDetermined(true);
      }
    },
    [datasetItem]
  );

  return (
    <div className="container">
      <div className="row mb-2 mb-md-5">
        {datasetItem &&
          themesItems &&
          provenanceItems &&
          frequencyItems &&
          referenceTypesItems &&
          referenceDatasetsItems &&
          openLicenseItems &&
          losItems && (
            <div className="col-12">
              <LanguagePicker
                languages={languages}
                toggleInputLanguage={toggleInputLanguage}
              />
              <FormTemplateWithState
                title={localization.datasets.formTemplates.title}
                required
                values={titleValues(title.values)}
                syncErrors={title.syncErrors}>
                <ConnectedFormTitle
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                  languages={languages}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.accessRight}
                required
                values={accessRightsValues(accessRights.values)}
                syncErrors={accessRights.syncErrors}>
                <ConnectedFormAccessRights
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.theme}
                required
                values={losValues(themes.values, losItems)}
                syncErrors={themes.syncErrors}>
                <ConnectedFormLOS
                  datasetItem={datasetItem}
                  losItems={losItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.euTheme}
                values={themesValues(themes.values)}
                syncErrors={themes.syncErrors}>
                <ConnectedFormThemes
                  datasetItem={datasetItem}
                  themesItems={themesItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.type}
                values={typeValues(type.values)}
                syncErrors={type.syncErrors}>
                <ConnectedFormType
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.concept}
                values={conceptValues(concept.values)}
                syncErrors={concept.syncErrors}>
                <ConnectedFormConcept
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.spatial}
                values={spatialValues(spatial.values)}
                syncErrors={spatial.syncErrors}>
                <ConnectedFormSpatial
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.provenance}
                values={provenanceValues(formProvenance.values)}
                syncErrors={formProvenance.syncErrors}>
                <ConnectedFormProvenance
                  datasetItem={datasetItem}
                  provenanceItems={provenanceItems}
                  frequencyItems={frequencyItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.content}
                values={contentsValues(contents.values)}
                syncErrors={contents.syncErrors}>
                <ConnectedFormContents
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.informationModel}
                values={informationModelValues(informationModel.values)}
                syncErrors={informationModel.syncErrors}>
                <ConnectedFormInformationModel
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.reference}
                values={referenceValues(reference.values)}>
                <ConnectedFormReference
                  datasetItem={datasetItem}
                  referenceTypesItems={referenceTypesItems}
                  referenceDatasetsItems={referenceDatasetsItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.contactInformation}
                values={contactPointValues(contactPoint.values)}
                syncErrors={contactPoint.syncErrors}>
                <ConnectedFormContactPoint
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.distributionAPI}
                values={distributionAPIValues(distribution.values)}>
                <FormDistributionApi
                  datasetItem={datasetItem}
                  catalogId={catalogId}
                  datasetId={datasetId}
                  datasetUri={_.get(datasetItem, 'uri')}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.distribution}
                backgroundBlue
                values={distributionValues(distribution.values)}
                syncErrors={distribution.syncErrors}>
                <FormDistribution
                  datasetItem={datasetItem}
                  openLicenseItems={openLicenseItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                  languages={languages}
                />
              </FormTemplateWithState>

              <FormTemplateWithState
                title={localization.datasets.formTemplates.sample}
                backgroundBlue
                values={sampleValues(sample.values)}
                syncErrors={sample.syncErrors}>
                <ConnectedFormSample
                  datasetItem={datasetItem}
                  openLicenseItems={openLicenseItems}
                  catalogId={catalogId}
                  datasetId={datasetId}
                  languages={languages}
                />
              </FormTemplateWithState>

              <StatusBar
                type="dataset"
                isSaving={datasetFormStatus && datasetFormStatus.isSaving}
                lastSaved={datasetItem._lastModified}
                published={datasetItem.registrationStatus === 'PUBLISH'}
                error={datasetFormStatus && datasetFormStatus.error}
                justPublishedOrUnPublished={
                  datasetFormStatus &&
                  datasetFormStatus.justPublishedOrUnPublished
                }
                onDelete={() =>
                  deleteAndNavigateToList({
                    history,
                    catalogId,
                    datasetId,
                    dispatchDeleteDataset
                  })
                }
                allowPublish={isAllowedToPublish(form)}
                formComponent={
                  <ConnectedFormPublish
                    initialItemStatus={_.get(
                      datasetItem,
                      'registrationStatus',
                      ''
                    )}
                    catalogId={catalogId}
                    datasetId={datasetId}
                  />
                }
              />
            </div>
          )}
        <div className="col-md-2" />
      </div>
    </div>
  );
}

DatasetRegistrationPagePure.defaultProps = {
  dispatchEnsureData: _.noop,
  dispatchDeleteDataset: _.noop,
  catalogId: null,
  datasetId: null,
  themesItems: null,
  provenanceItems: null,
  frequencyItems: null,
  form: {},
  datasetItem: null,
  referenceTypesItems: null,
  referenceDatasetsItems: null,
  openLicenseItems: null,
  datasetFormStatus: null,
  history: null,
  losItems: null,
  languages: [],
  setInputLanguages: _.noop,
  toggleInputLanguage: _.noop
};

DatasetRegistrationPagePure.propTypes = {
  dispatchEnsureData: PropTypes.func,
  dispatchDeleteDataset: PropTypes.func,
  catalogId: PropTypes.string,
  datasetId: PropTypes.string,
  themesItems: PropTypes.array,
  provenanceItems: PropTypes.array,
  frequencyItems: PropTypes.array,
  form: PropTypes.object,
  datasetItem: PropTypes.object,
  referenceTypesItems: PropTypes.array,
  referenceDatasetsItems: PropTypes.array,
  openLicenseItems: PropTypes.array,
  datasetFormStatus: PropTypes.object,
  history: PropTypes.object,
  losItems: PropTypes.array,
  languages: PropTypes.array,
  setInputLanguages: PropTypes.func,
  toggleInputLanguage: PropTypes.func
};
