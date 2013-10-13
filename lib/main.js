'use strict';

const storageService = require('./service/storage');

storageService.init();

exports.main = function (options, callbacks) {
  var widget = require('./controller/widget').widget;
};

exports.onUnload = function (reason) {
  require('./hooks/unload').execute(reason);
};
