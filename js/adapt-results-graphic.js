import components from 'core/js/components';
import ResultsGraphicModel from './resultsGraphicModel';
import ResultsGraphicView from './resultsGraphicView';

export default components.register('results-graphic', {
  model: ResultsGraphicModel,
  view: ResultsGraphicView
});
