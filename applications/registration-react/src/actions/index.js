import { CALL_API } from '../middleware/api';
import * as actions from '../constants/ActionTypes';
// import * as routing from '../constants/Routing';

function fetchApi(url, types) {
  return {
    [CALL_API]: {
      types,
      url
    }
  };
}

function shouldFetchApi(state) {
  return !state.isFetching;
}

export function fetchDatasetIfNeeded(datasetURL) {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().dataset) && dispatch(
      fetchApi(datasetURL, [actions.DATASET_REQUEST, actions.DATASET_SUCCESS, actions.DATASET_FAILURE])
    );
}

export function fetchReferenceDatasetsIfNeeded(datasetURL) {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().referenceDatasets) && dispatch(
      fetchApi(datasetURL, [actions.REFERENCEDATASETS_REQUEST, actions.REFERENCEDATASETS_SUCCESS, actions.REFERENCEDATASETS_FAILURE])
    );
}

export function fetchHelptextsIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().helptexts) && dispatch(
      fetchApi('/reference-data/helptexts', [actions.HELPTEXTS_REQUEST, actions.HELPTEXTS_SUCCESS, actions.HELPTEXTS_FAILURE])
    );
}

export function fetchProvenanceIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().provenance) && dispatch(
      fetchApi('/reference-data/codes/provenancestatement', [actions.PROVENANCE_REQUEST, actions.PROVENANCE_SUCCESS, actions.PROVENANCE_FAILURE])
    );
}

export function fetchFrequencyIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().frequency) && dispatch(
      fetchApi('/reference-data/codes/frequency', [actions.FREQUENCY_REQUEST, actions.FREQUENCY_SUCCESS, actions.FREQUENCY_FAILURE])
    );
}

export function fetchThemesIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().themes) && dispatch(
      fetchApi('/reference-data/themes', [actions.THEMES_REQUEST, actions.THEMES_SUCCESS, actions.THEMES_FAILURE])
    );
}

export function fetchUserIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().user) && dispatch(
      fetchApi('/innloggetBruker', [actions.USER_REQUEST, actions.USER_SUCCESS, actions.USER_FAILURE])
    );
}

export function fetchReferenceTypesIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().referenceTypes) && dispatch(
      fetchApi('/reference-data/codes/referencetypes', [actions.REFERENCETYPES_REQUEST, actions.REFERENCETYPES_SUCCESS, actions.REFERENCETYPES_FAILURE])
    );
}


export function publishDataset(value) {
  return dispatch =>
    dispatch({
      type: actions.PUBLISHDATASET,
      registrationStatus: value
    });
}

export function datasetLastSaved(value) {
  return dispatch =>
    dispatch({
      type: actions.DATASET_LAST_SAVED,
      lastSaved: value
    });
}


