import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import moment from 'moment';

import localization from '../../utils/localization';
import Helptext from '../reg-form-helptext';
import InputTagsFieldArray from '../reg-form-field-input-tags-objects';
import DatepickerField from '../reg-form-field-datepicker';
import CheckboxField from '../reg-form-field-checkbox';
import asyncValidate from '../../utils/asyncValidate';
import { languageType } from '../../schemaTypes';


const validate = values => {
  const errors = {}
  const spatial = (values.spatial && values.spatial.uri) ? values.spatial.uri : null;
  if (spatial && spatial.length < 2) {
    errors.spatial = { uri: localization.validation.minTwoChars}
  }
  return errors
}

const formatTemporalUnixDatesToISO = values => {
  let temporals  = null;
  if (values && values.length > 0) {
    temporals = values.map(item => (
      {
        startDate: moment(item.startDate).format('YYYY-MM-DD'),
        endDate: moment(item.endDate).format('YYYY-MM-DD'),
      }
    ))
  }
  return temporals;
}

const renderTemporalFields = (item, index, fields, props) => (
  <div className="d-flex" key={index}>
    <div className="w-50">
      <Field
        name={`${item}.startDate`}
        type="text"
        component={DatepickerField}
        label="Fra"
        showLabel
      />
    </div>
    <div className="w-50">
      <Field
        name={`${item}.endDate`}
        type="text"
        component={DatepickerField}
        label="Til"
        showLabel
      />
    </div>
    <div className="d-flex align-items-end">
      <button
        type="button"
        title="Remove temporal"
        onClick={
          () => {
            if (fields.length === 1) {
              fields.remove(index);
              fields.push({});
            }

            if (fields.length > 1) {
              fields.remove(index);
            }
            asyncValidate(fields.getAll(), null, props, `remove_temporal_${index}`);
          }
        }
      >
        <i className="fa fa-trash mr-2" />
      </button>
    </div>
  </div>
);

const renderTemporal = (props) => {
  const { fields } = props;

  return (
    <div>
      {fields && fields.map((item, index) =>
        renderTemporalFields(item, index, fields, props)
      )}
      <button type="button" onClick={() => fields.push({})}>
        <i className="fa fa-plus mr-2" />
        Legg til tidsperiode
      </button>
    </div>
  );
};

let FormSpatial = props => {
  const { helptextItems, initialValues } = props;
  if (initialValues ) {
    return (
      <form>
        <div className="form-group">
          <Helptext title="Geografisk avgrensning" helptextItems={helptextItems.Dataset_spatial} />
          <Field
            name="spatial"
            type="text"
            component={InputTagsFieldArray}
            label="Geografisk avgrensning"
            fieldLabel="uri"
          />
        </div>
        <div className="form-group">
          <Helptext title="Tidsmessig avgrenset til" helptextItems={helptextItems.Dataset_temporal} />
          <FieldArray
            name="temporal"
            component={renderTemporal}
          />
        </div>
        <div className="form-group">
          <Helptext title="Utgivelsesdato" helptextItems={helptextItems.Dataset_issued} />
          <Field
            name="issued"
            type="text"
            component={DatepickerField}
            label="Utgivelsesdato"
          />
        </div>
        <div className="form-group">
          <Helptext title="Språk" helptextItems={helptextItems.Dataset_language} />
          <Field
            name="language"
            component={CheckboxField}
          />
        </div>

      </form>
    )
  } return null;
}

FormSpatial = reduxForm({
  form: 'spatial',
  validate,
  asyncValidate,
})(FormSpatial)

const mapStateToProps = ({ dataset }) => (
  {
    initialValues: {
      spatial: (dataset.result.spatial && dataset.result.spatial.length > 0) ? dataset.result.spatial : '',
      temporal: formatTemporalUnixDatesToISO(dataset.result.temporal) || [{startDate: '', endDate: ''}],
      issued: moment(dataset.result.issued).format('YYYY-MM-DD') || null,
      language: (dataset.result.language && dataset.result.language.length > 0) ? dataset.result.language : [languageType],
    }
  }
)

export default connect(mapStateToProps)(FormSpatial)
