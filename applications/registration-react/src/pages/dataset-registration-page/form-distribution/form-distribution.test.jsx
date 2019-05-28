import React from 'react';
import { shallow } from 'enzyme';
import {
  FormDistribution,
  renderDistributions,
  renderDistributionLandingpage
} from './form-distribution.component';
import { distributionTypes } from './connected-form-distribution.component';
import openlicenses from '../../../../test/fixtures/openlicenses';
import distribution from '../../../../test/fixtures/distributions';

let defaultProps;
let wrapper;

beforeEach(() => {
  const { openLicenseItems } = openlicenses;
  defaultProps = {
    initialValues: {
      distribution: distributionTypes(distribution),
      openLicenseItems
    }
  };
  wrapper = shallow(<FormDistribution {...defaultProps} />);
});

test('should render FormDistribution correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render renderDistributions correctly', () => {
  wrapper = shallow(renderDistributions(defaultProps));
  expect(wrapper).toMatchSnapshot();
});

test('should render renderDistributionLandingpage correctly', () => {
  wrapper = shallow(renderDistributionLandingpage(defaultProps));
  expect(wrapper).toMatchSnapshot();
});
