import Ember from 'ember';
const {on, getOwner} = Ember;

export function initialize() {
  Ember.Router.reopen({
    _logWillTransition: on('willTransition', function() {
      const logger = getOwner(this).lookup('service:logger');
      logger && logger.willTransition(...arguments);
    }),
    _logDidTransition: on('didTransition', function() {
      const logger = getOwner(this).lookup('service:logger');
      logger && logger.didTransition(...arguments);
    }),
  });
}

export default {
  name: 'logger-router',
  initialize
};
