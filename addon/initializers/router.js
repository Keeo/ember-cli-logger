import Ember from 'ember';
const {on, getOwner} = Ember;

export function initialize() {
  Ember.Router.reopen({
    _logWillTransition: on('willTransition', function() {
      getOwner(this).lookup('service:logger').willTransition(...arguments);
    }),
    _logDidTransition: on('didTransition', function() {
      getOwner(this).lookup('service:logger').didTransition(...arguments);
    }),
  });
}

export default {
  name: 'logger-router',
  initialize
};
