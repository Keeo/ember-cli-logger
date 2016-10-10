import Ember from 'ember';
import config from '../utils/config';
const {inject: {service}, getOwner, isPresent, isNone, computed, A} = Ember;

const LogTransition = Ember.Object.extend({
  start: undefined,
  end: undefined,
  targetName: undefined,
  params: undefined,

  delta: computed('start', 'end', function() {
    return this.get('end') - this.get('start');
  }),
});

export default Ember.Service.extend({
  reporter: service(),

  init() {
    this.set('boot', Ember.Object.create({
      start: window._bootTime,
    }));
    this.set('transitions', A());
    this.set('config', config(getOwner(this)));
  },

  willTransition(transition) {
    const params = this._getParams(transition);
    const log = LogTransition.create({
      start: performance.now(),
      params,
      targetName: transition.targetName,
    });
    this.get('transitions').pushObject(log);
  },

  didTransition() {
    const log = this.get('transitions.lastObject');
    if (isNone(log.get('end'))) {
      log.set('end', performance.now());
    }
    this.logTransition(log);
  },

  logError(error) {
    this.log('error', 'general', error.message, error.stack);
    this.get('reporter').reportError(error);
  },

  logTransition(transition) {
    this.log('info', 'transition', transition.targetName, transition.get('delta'));
    this.get('reporter').reportTransition(transition);
  },

  log(severity, type, ...args) {
    if (this.get('config.isConsoleEnabled')) {
      console.log(`[${severity.toUpperCase()}]`, `${type.capitalize()}:`, ...args);
    }
  },

  bootCompleted() {
    const {start, applicationReady, finish} = this.get('boot');
    this.log('info', 'boot', start, applicationReady, finish);
    this.get('reporter').reportBoot(this.get('boot'));
  },

  _getParams(transition) {
    const params = {};

    Object.keys(transition.params).forEach(key => {
      const paramKey = Object.keys(transition.params[key]);
      if (isPresent(paramKey)) {
        params[paramKey] = transition.params[key][paramKey];
      }
    });

    return params;
  },
});
