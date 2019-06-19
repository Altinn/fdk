import _ from 'lodash';
import {
  CATALOGS_FAILURE,
  CATALOGS_REQUEST,
  CATALOGS_SUCCESS
} from '../../constants/ActionTypes';
import { registrationApiGet } from '../../api/registration-api';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { catalogsPath } from '../../api/catalog-registration-api';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export const fetchCatalogsIfNeeded = () => (dispatch, getState) =>
  shouldFetch(_.get(getState(), 'catalogs')) &&
  dispatch(
    reduxFsaThunk(() => registrationApiGet(catalogsPath), {
      onBeforeStart: { type: CATALOGS_REQUEST },
      onSuccess: { type: CATALOGS_SUCCESS },
      onError: { type: CATALOGS_FAILURE }
    })
  );

const initialState = { isFetchingCatalogs: false, catalogItems: null };

export default function catalogs(state = initialState, action) {
  switch (action.type) {
    case CATALOGS_REQUEST:
      return {
        ...state,
        isFetching: true,
        lastFetch: null
      };
    case CATALOGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        lastFetch: Date.now(),
        catalogItems: _.get(action.payload, ['_embedded', 'catalogs'])
      };
    case CATALOGS_FAILURE:
      return {
        ...state,
        isFetching: false,
        lastFetch: null,
        catalogItems: null
      };
    default:
      return state;
  }
}

export const getCatalogItemByCatalogId = (catalogItems, catalogId) => {
  if (Array.isArray(_.get(catalogItems, ['_embedded', 'catalogs']))) {
    return _.get(catalogItems, ['_embedded', 'catalogs']).filter(
      item => item.id === catalogId
    )[0];
  }
  return null;
};
