'use strict';

let simpleStorage = require('sdk/simple-storage');

let StorageService = function () { }

StorageService.prototype.init = function () {
  if (typeof simpleStorage.storage.activated === 'undefined')
    simpleStorage.storage.activated = false;
  if (!simpleStorage.storage.presets)
    simpleStorage.storage.presets = [];
}

// Temporary
StorageService.prototype.setCurrentPreset = function (preset) {
  if (!this.isEmpty())
    simpleStorage.storage.presets[0] = preset;
  else
    this.add(preset);
}

StorageService.prototype.getCurrentPreset = function () {
  return simpleStorage.storage.presets[0];
}

StorageService.prototype.hasPreset = function () {
  return !this.isEmpty();
}

StorageService.prototype.add = function (preset) {
  simpleStorage.storage.presets.push(preset);
}

StorageService.prototype.isEmpty = function (preset) {
  return simpleStorage.storage.presets.length == 0;
}

StorageService.prototype.uninstall = function () {
  delete simpleStorage.storage.activated;
  delete simpleStorage.storage.presets;
}

StorageService.__proto__ = new StorageService;
module.exports = StorageService;
