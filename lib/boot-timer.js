/* global require, module */
const Filter = require('broccoli-filter');

const timer = `
<script>
  window._bootTime = window.performance.now();
</script>
`;

let polyfill = `
<script>
(function(undefined) {!function(n){var e=Date.now();n.performance||(n.performance={}),n.performance.now=function(){return Date.now()-e}}(this);}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
</script>
`;

function BootTimer(inputTree, isPerformancePolyfillEnabled) {
  if (!isPerformancePolyfillEnabled) {
    polyfill = '';
  }

  if (!(this instanceof BootTimer)) {
    return new BootTimer(inputTree, isPerformancePolyfillEnabled);
  }

  Filter.call(this, inputTree);

  this.name = 'boot-timer';
  this.inputTree = inputTree;
}

BootTimer.prototype = Object.create(Filter.prototype);
BootTimer.prototype.constructor = BootTimer;
BootTimer.prototype.extensions = ['html'];
BootTimer.prototype.targetExtension = 'html';
BootTimer.prototype.processString = function(string) {
  return string.replace('<body>', '<body>' + "\n" + polyfill + timer);
};

module.exports = BootTimer;
