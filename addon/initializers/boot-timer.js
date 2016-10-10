import Ember from 'ember';
const {on, getOwner, isEmpty} = Ember;

export function initialize(application) {
  const parent = application.ready;
  application.ready = function() {
    parent && parent.apply(this, arguments);

    const logger = this.__container__.lookup('service:logger');
    logger.set('boot.applicationReady', performance.now());
  };

  Ember.Router.reopen({
    _logBootTime: on('didTransition', function() {
      const logger = getOwner(this).lookup('service:logger');
      if (isEmpty(logger.get('boot.finish'))) {
        logger.set('boot.finish', performance.now());
        logger.bootCompleted();
      }
    }),
  });
}

export default {
  name: 'logger-boot-time',
  initialize
};
