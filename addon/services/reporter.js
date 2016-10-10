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
    const {ajax, tick, instanceId} = this.getProperties('ajax', 'tick', 'instanceId');
    this.incrementProperty('tick');

    data.tick = tick;
    data.instance = instanceId;

    if (isReportingEnabled) {
      assert(`When isReportingEnabled is enabled endpoint must be present. Got: ${endpoint} instead.`, isPresent(endpoint));
      ajax.post(endpoint + url, {data}).catch(e => {
        info('Reporter failed to dispatch message:', e);
      });
    }
  },

  instanceId: computed(() => {
    return parseInt(Math.random() * 1000000000);
  }),
});
