'use strict';

const dpiService = require('../service/dpi');
const storageService = require('../service/storage');

var Unload = function () {};

Unload.prototype.execute = function (reason) {
  this[this.getHookFromReason(reason)].apply(this, []);
};

Unload.prototype.getHookFromReason = function (reason) {
  return ['on', this.capitalize(reason)].join('');
};

Unload.prototype.capitalize = function (word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
};

Unload.prototype.onDisable = function() {
  dpiService.resetToBrowserDefault();
};


Unload.prototype.onUninstall = function() {
  this.onDisable();
  storageService.uninstall();
};

Unload.prototype.onUpgrade = function() {
};

Unload.prototype.onDowngrade = function() {
};

Unload.prototype.onShutdown = function() {
};

Unload.__proto__ = new Unload;
module.exports = Unload;
