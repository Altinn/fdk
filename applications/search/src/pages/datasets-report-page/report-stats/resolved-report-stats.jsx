import _ from 'lodash';
import { resolve } from 'react-resolver';
import { getDatasetStats } from '../../../api/get-dataset-stats';
import { ConnectedReportStats } from './connected-report-stats';
import { getApiStats } from '../../../api/get-api-stats';
import { getConceptStats } from '../../../api/get-concept-stats';
import { getConceptsByURIs } from '../../../api/concepts';

const memoizedGetDatasetStats = _.memoize(getDatasetStats);
const memoizedGetApiStats = _.memoize(getApiStats);
const memoizedGetConceptStats = _.memoize(getConceptStats);
const memoizedGetConceptsByURIs = _.memoize(getConceptsByURIs);

const mapProps = {
  datasetStats: props => memoizedGetDatasetStats({ orgPath: props.orgPath }),
  apiStats: props => memoizedGetApiStats({ orgPath: props.orgPath }),
  conceptStats: props => memoizedGetConceptStats({ orgPath: props.orgPath }),
  mostUsedConcepts: async props => {
    const conceptStats = await memoizedGetConceptStats({
      orgPath: props.orgPath
    });
    const datasetCountsByConceptUri = _.get(
      conceptStats,
      'datasetCountsByConceptUri',
      {}
    );

    const mostUsedConceptsArray = _.orderBy(
      datasetCountsByConceptUri,
      [conceptsWithDataset => conceptsWithDataset.length],
      ['desc']
    )
      .reduce((result, value) => {
        result.push(_.get(value, [0, 'subjectUri']));
        return result;
      }, [])
      .slice(0, 4);

    const result = await Promise.resolve(
      memoizedGetConceptsByURIs(mostUsedConceptsArray.join())
    );
    return _.get(result, ['_embedded', 'concepts']);
  }
};

export const ResolvedReportStats = resolve(mapProps)(ConnectedReportStats);
