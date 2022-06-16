import Adapt from 'core/js/adapt';
import ComponentModel from 'core/js/models/componentModel';

export default class ResultsGraphicModel extends ComponentModel {

  init(...args) {
    this.set({
      'graphic': this.get('_graphic')._src,
      'alt': this.get('_graphic').alt
    });

    // Check if specific assessment is being shown or all assessments
    if (this.has('_assessmentId') && this.get('_assessmentId') !== "") {
      this.listenTo(Adapt, 'assessments:complete', this.onAssessmentsComplete);
    } else {
      this.listenTo(Adapt, 'assessment:complete', this.onAssessmentComplete);
    }

    super.init(...args);

    this.setupModelResetEvent();

    this.checkIfVisible();
  }

  checkIfVisible() {
    if (!Adapt.assessment) {
      return false;
    }

    const isVisibleBeforeCompletion = this.get('_isVisibleBeforeCompletion') || false;
    let isVisible = false;
    const wasVisible = this.get('_isVisible');
    let isComplete;

    // Check if specific assessment is being shown or all assessments
    if(this.has('_assessmentId') && this.get('_assessmentId') !== "") {
      const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
      if (!assessmentModel || assessmentModel.length === 0) return;

      const state = assessmentModel.getState();
      isComplete = state.isComplete;
      const isAttemptInProgress = state.attemptInProgress;
      const attemptsSpent = state.attemptsSpent;
      const hasHadAttempt = (!isAttemptInProgress && attemptsSpent > 0);

      isVisible = (isVisibleBeforeCompletion && !isComplete) || hasHadAttempt;

      if (!wasVisible && isVisible) isVisible = false;

    } else {

      const assessmentArticleModels = Adapt.assessment.get();
      if (assessmentArticleModels.length === 0) return;

      isComplete = this.isComplete();

      if (!isVisibleBeforeCompletion) isVisible = isVisible || isComplete;
    }

    this.set('_isVisible', isVisible, {pluginName: 'results-graphic'});
  }

  checkIfComplete() {
    if (!Adapt.assessment) {
      return false;
    }

    // Check if specific assessment is being shown or all assessments
    if (this.has('_assessmentId') && this.get('_assessmentId') !== "") {

      const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
      if (!assessmentModel || assessmentModel.length === 0) return;

      const state = assessmentModel.getState();
      if (state.isComplete) {
        this.onAssessmentsComplete(state);
      } else {
        this.reset('hard', true);
      }
    } else  {
      let isComplete = this.isComplete();

      if (isComplete) this.onAssessmentComplete(Adapt.assessment.getState());
    }
  }

  isComplete() {
    let isComplete = false;
    const assessmentArticleModels = Adapt.assessment.get();

    if (assessmentArticleModels.length === 0) return;

    for (let i = 0, l = assessmentArticleModels.length; i < l; i++) {
      const articleModel = assessmentArticleModels[i];
      const assessmentState = articleModel.getState();
      isComplete = assessmentState.isComplete;
      if (!isComplete) break;
    }

    if (!isComplete) {
      this.reset("hard", true);
    }

    return isComplete;
  }

  setupModelResetEvent() {
    if (this.onAssessmentsReset) return;
    this.onAssessmentsReset = function(state) {

    if (this.get('_assessmentId') === undefined ||
      this.get('_assessmentId') != state.id) return;
      this.reset('hard', true);
    };

    this.listenTo(Adapt, 'assessments:reset', this.onAssessmentsReset);
  }

  onAssessmentsComplete(state) {
    if (this.get('_assessmentId') === undefined ||
      this.get('_assessmentId') != state.id) return;

    /*
    make shortcuts to some of the key properties in the state object so that
    content developers can just use {{attemptsLeft}} in json instead of {{state.attemptsLeft}}
    */
    this.set( {
      _state: state,
      attempts: state.attempts,
      attemptsSpent: state.attemptsSpent,
      attemptsLeft: state.attemptsLeft,
      score: state.score,
      scoreAsPercent: state.scoreAsPercent,
      maxScore: state.maxScore,
      isPass: state.isPass
    });

    const feedbackBand = this.getFeedbackBand();

    this.setFeedback(feedbackBand);

    this.show();
  }

  onAssessmentComplete(state) {
    this.set('_state', state);

    const feedbackBand = this.getFeedbackBand();

    this.setFeedback(feedbackBand);

    this.show();
  }

  show() {
    if (!this.get('_isVisible')) {
      this.set('_isVisible', true, {pluginName: 'results-graphic'});
    }
  }

  setFeedback(feedbackBand) {
    const state = this.get('_state');
    state.feedbackBand = feedbackBand;

    state.graphic = feedbackBand._src;
    state.alt = feedbackBand.alt;

    this.set('graphic', state.graphic);
    this.set('alt', state.alt);
  }

  getFeedbackBand() {
    const state = this.get('_state');
    const scoreProp = state.isPercentageBased ? 'scoreAsPercent' : 'score';
    const bands = _.sortBy(this.get('_bands'), '_score');

    for (let i = (bands.length - 1); i >= 0; i--) {
      if (state[scoreProp] >= bands[i]._score) {
        return bands[i];
      }
    }

    return "";
  }
}
