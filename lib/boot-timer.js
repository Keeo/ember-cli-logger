/* global require, module */
const Filter = require('broccoli-filter');

const timer = `
<script>
  if (performance) {
    window._bootTime = performance.now();
  }
</script>
`;

function BootTimer(inputTree) {
  if (!(this instanceof BootTimer)) {
    return new BootTimer(inputTree);
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
  return string.replace('<body>', '<body>' + "\n" + timer);
};

module.exports = BootTimer;
