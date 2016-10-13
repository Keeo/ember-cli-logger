/* jshint node: true */
'use strict';

const BootTimer = require('./lib/boot-timer');

module.exports = {
  name: 'ember-cli-logger',

  included: function(app) {
    this.app = app;

    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app;
    }

    this._super.included.apply(this, arguments);
    this.isEnabled = this.app.options.measureBootTime || false;

    const polyfill = this.app.options.isPerformancePolyfillEnabled;
    this.isPerformancePolyfillEnabled = polyfill !== undefined ? polyfill : true;
  },

  postprocessTree: function (type, tree) {
    if(!this.isEnabled) {
      return tree;
    }

    if (type === 'all') {
      return new BootTimer(tree, this.isPerformancePolyfillEnabled);
    }

    return tree;
  }
};
