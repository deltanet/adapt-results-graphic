import Adapt from 'core/js/adapt';
import ResultsGraphicModel from './resultsGraphicModel';
import ResultsGraphicView from './resultsGraphicView';

export default Adapt.register('results-graphic', {
  model: ResultsGraphicModel,
  view: ResultsGraphicView
});
