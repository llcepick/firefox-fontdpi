'use strict';

const devPixelsPerPx = 'layout.css.devPixelsPerPx';
let preferenceService = require('sdk/preferences/service');
let DpiService = function() { }

DpiService.prototype.setFontDpi = function(dpi) {
  let factor = this.calculateFactor(dpi);
  this.writeToPreference(factor);
}

DpiService.prototype.calculateFactor = function(dpi) {
  return (dpi / 96).toFixed(5);
}

DpiService.prototype.writeToPreference = function(factor) {
  preferenceService.set(devPixelsPerPx, factor);
}

DpiService.prototype.resetToBrowserDefault = function() {
  preferenceService.reset(devPixelsPerPx);
}

DpiService.__proto__ = new DpiService;
module.exports = DpiService;
