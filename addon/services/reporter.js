import Ember from 'ember';
import config from '../utils/config';
const {inject: {service}, assert, isPresent, computed, getOwner, Logger: {info}} = Ember;

export default Ember.Service.extend({
  ajax: service(),

  init() {
    this.set('browser', navigator.userAgent);
    this.set('tick', 0);
    this.set('config', config(getOwner(this)));
  },

  reportTransition(transition) {
    this.report('/transition', {
      name: transition.targetName,
      time: transition.get('delta'),
      params: JSON.stringify(transition.get('params')),
    });
  },

  reportError(error) {
    this.report('/error', {
      message: JSON.stringify(error.message),
      stack: JSON.stringify(error.stack),
    });
  },

  reportCustom(severity, message, time) {
    this.report('/log', {
      severity,
      message,
      time,
    });
  },

  reportBoot(boot) {
    this.report('/boot', {
      start: boot.start,
      ready: boot.applicationReady,
      finish: boot.finish,
      browser: this.get('browser'),
      server: this.get('config.server'),
    });
  },

  report(url, data) {
    const config = this.get('config');
    const {isReportingEnabled, endpoint} = config.getProperties('isReportingEnabled', 'endpoint');
    const {tick, instanceId} = this.getProperties('tick', 'instanceId');
    this.incrementProperty('tick');

    data.tick = tick;
    data.instance = instanceId;

    if (isReportingEnabled) {
      assert(`When isReportingEnabled is enabled endpoint must be present. Got: ${endpoint} instead.`, isPresent(endpoint));
      this._post(endpoint + url, {data}).catch(e => {
        info('Reporter failed to dispatch message:', e);
      });
    }
  },

  _post(url, data) {
    return this.get('ajax').post(url, data);
  },

  instanceId: computed(() => {
    return parseInt(Math.random() * 1000000000);
  }),
});
