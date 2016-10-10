/* jshint node: true */
'use strict';

const BootTimer = require('./lib/boot-timer');

module.exports = {
  name: 'ember-cli-logger',

  isDevelopingAddon() {
    return true;
  },

  included: function(app) {
    this.app = app;

    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app;
    }

    this._super.included.apply(this, arguments);
    this.isEnabled = this.app.options.measureBootTime || false;
  },

  postprocessTree: function (type, tree) {
    if (type === 'all') {
      return new BootTimer(tree);
    }

    return tree;
  }
};
