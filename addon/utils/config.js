import Ember from 'ember';
const {assign} = Ember;

export default function (container) {
  const userConfig = container.resolveRegistration('config:environment').logger;

  const config = assign({
    isReportingEnabled: false,
    isErrorHookEnabled: false,
    isConsoleEnabled: false,
    endpoint: null,
    server: 'development',
  }, userConfig);

  return Ember.Object.create(config);
}
