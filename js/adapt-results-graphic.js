define([
    'core/js/adapt',
    'core/js/views/componentView',
    'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

    var ResultsGraphicView = ComponentView.extend({

        preRender: function () {
            if (this.model.setLocking) this.model.setLocking("_isVisible", false);

            this.setStartGraphic();

            this.setupEventListeners();

            this.setupModelResetEvent();

            this.checkIfComplete();

            this.checkIfVisible();
        },

        setStartGraphic: function() {
            this.model.set({
                "graphic": this.model.get("_graphic")._src,
                "alt": this.model.get("_graphic").alt
            });
        },

        checkIfVisible: function() {

            if (!Adapt.assessment) {
                return false;
            }

            var isVisibleBeforeCompletion = this.model.get("_isVisibleBeforeCompletion") || false;
            var isVisible = false;
            var wasVisible = this.model.get("_isVisible");

            // Check if specific assessment is being shown or all assessments
            if(this.model.has("_assessmentId") && this.model.get("_assessmentId") !== "") {
              var assessmentModel = Adapt.assessment.get(this.model.get("_assessmentId"));
              if (!assessmentModel || assessmentModel.length === 0) return;

              var state = assessmentModel.getState();
              var isComplete = state.isComplete;
              var isAttemptInProgress = state.attemptInProgress;
              var attemptsSpent = state.attemptsSpent;
              var hasHadAttempt = (!isAttemptInProgress && attemptsSpent > 0);

              isVisible = (isVisibleBeforeCompletion && !isComplete) || hasHadAttempt;

              if (!wasVisible && isVisible) isVisible = false;

            } else {

              var assessmentArticleModels = Adapt.assessment.get();
              if (assessmentArticleModels.length === 0) return;

              var isComplete = this.isComplete();

              if (!isVisibleBeforeCompletion) isVisible = isVisible || isComplete;
            }

            this.model.set('_isVisible', isVisible, {pluginName: "results-graphic"});
        },

        checkIfComplete: function() {

            if (!Adapt.assessment) {
                return false;
            }

            // Check if specific assessment is being shown or all assessments
            if(this.model.has("_assessmentId") && this.model.get("_assessmentId") !== "") {

              var assessmentModel = Adapt.assessment.get(this.model.get("_assessmentId"));
              if (!assessmentModel || assessmentModel.length === 0) return;

              var state = assessmentModel.getState();
              if (state.isComplete) {
                  this.onAssessmentsComplete(state);
              } else {
                  this.model.reset('hard', true);
              }

            } else  {
              var isComplete = this.isComplete();

              if (isComplete) this.onAssessmentComplete(Adapt.assessment.getState());
            }
        },

        isComplete: function() {
            var isComplete = false;

            var assessmentArticleModels = Adapt.assessment.get();
            if (assessmentArticleModels.length === 0) return;

            for (var i = 0, l = assessmentArticleModels.length; i < l; i++) {
                var articleModel = assessmentArticleModels[i];
                var assessmentState = articleModel.getState();
                isComplete = assessmentState.isComplete;
                if (!isComplete) break;
            }

            if (!isComplete) {
                this.model.reset("hard", true);
            }

            return isComplete;
        },

        setupModelResetEvent: function() {
            if (this.model.onAssessmentsReset) return;
            this.model.onAssessmentsReset = function(state) {
                if (this.get("_assessmentId") === undefined ||
                    this.get("_assessmentId") != state.id) return;

                this.reset('hard', true);
            };
            this.model.listenTo(Adapt, 'assessments:reset', this.model.onAssessmentsReset);
        },

        postRender: function() {
            this.setReadyStatus();
            this.setupInview();
        },

        setupInview: function() {
            this.setupInviewCompletion('.component-widget');
        },

        setupEventListeners: function() {
          // Check if specific assessment is being shown or all assessments
          if(this.model.has("_assessmentId") && this.model.get("_assessmentId") !== "") {
            this.listenTo(Adapt, 'assessments:complete', this.onAssessmentsComplete);
          } else {
            this.listenTo(Adapt, 'assessment:complete', this.onAssessmentComplete);
          }
          this.listenToOnce(Adapt, 'remove', this.onRemove);
        },

        removeEventListeners: function() {
          // Check if specific assessment is being shown or all assessments
          if(this.model.has("_assessmentId") && this.model.get("_assessmentId") !== "") {
            this.stopListening(Adapt, 'assessments:complete', this.onAssessmentsComplete);
          } else {
            this.stopListening(Adapt, 'assessment:complete', this.onAssessmentComplete);
          }
          this.stopListening(Adapt, 'remove', this.onRemove);
        },

        onAssessmentsComplete: function(state) {
            if (this.model.get("_assessmentId") === undefined ||
                this.model.get("_assessmentId") != state.id) return;
            /*
            make shortcuts to some of the key properties in the state object so that
            content developers can just use {{attemptsLeft}} in json instead of {{state.attemptsLeft}}
            */
            this.model.set( {
                _state: state,
                attempts: state.attempts,
                attemptsSpent: state.attemptsSpent,
                attemptsLeft: state.attemptsLeft,
                score: state.score,
                scoreAsPercent: state.scoreAsPercent,
                maxScore: state.maxScore,
                isPass: state.isPass
            });

            var feedbackBand = this.getFeedbackBand();

            this.setFeedback(feedbackBand);

            this.render();

            this.show();
        },

        onAssessmentComplete: function(state) {
            this.model.set("_state", state);

            var feedbackBand = this.getFeedbackBand();

            this.setFeedback(feedbackBand);

            this.render();

            this.show();
        },

        show: function() {
            if(!this.model.get('_isVisible')) {
                this.model.set('_isVisible', true, {pluginName: "results-graphic"});
            }
        },

        setFeedback: function(feedbackBand) {
            var state = this.model.get("_state");
            state.feedbackBand = feedbackBand;

            state.graphic = feedbackBand._src;
            state.alt = feedbackBand.alt;

            this.model.set("graphic", state.graphic);
            this.model.set("alt", state.alt);
        },

        getFeedbackBand: function() {
            var state = this.model.get("_state");
            var scoreProp = state.isPercentageBased ? 'scoreAsPercent' : 'score';
            var bands = _.sortBy(this.model.get("_bands"), '_score');

            for (var i = (bands.length - 1); i >= 0; i--) {
                if (state[scoreProp] >= bands[i]._score) {
                    return bands[i];
                }
            }

            return "";
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        onRemove: function() {
          if (this.model.unsetLocking) this.model.unsetLocking("_isVisible");

          this.removeEventListeners();
        }

      },
  {
      template: 'results-graphic'
  });

  return Adapt.register('results-graphic', {
      model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
      view: ResultsGraphicView
  });
});
