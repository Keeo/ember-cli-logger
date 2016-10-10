import Ember from 'ember';
import config from '../utils/config';
const {typeOf, assert} = Ember;

export function initialize(appInstance) {
  if (!config(appInstance).isErrorHookEnabled) {
    return;
  }

  const logger = appInstance.lookup('service:logger');

  const onError = Ember.onerror;
  Ember.onerror = function(error) {
    logger.logError(error);
    if (typeOf(onError) === 'function') {
      onError.call(this, error);
    } else {
      assert(error);
    }
  };
}

export default {
  name: 'logger-error',
  initialize
};
