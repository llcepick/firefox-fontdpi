'use strict';

const widgets = require('sdk/widget');
const tabs = require('sdk/tabs');
const data = require('self').data;
const dpiService = require('../service/dpi');
const storageService = require('../service/storage');

var dpiActivated = storageService.hasPreset();

var switcherWidget = widgets.Widget({
    id: 'dpi-switcher',
    label: 'DPI Switcher',
    tooltip: 'Left-click to toggle custom DPI\nRight-click to set the DPI',
    contentURL: data.url('widget/main.html')
});



switcherWidget.port.on('left-click', function() {
  if (storageService.hasPreset()) {
    switcherWidget.port.emit('toggle-activation', toggleActivation());
    if (dpiActivated) {
      dpiService.setFontDpi(storageService.getCurrentPreset());
    } else {
      dpiService.resetToBrowserDefault();
    }
  } else {
    promptForCustomDpi();
  }
});

switcherWidget.port.on('right-click', function() {
  promptForCustomDpi();
});

switcherWidget.port.on('set-current-preset', function(payload) {
  storageService.setCurrentPreset(payload);
  dpiService.setFontDpi(payload);
  dpiActivated = true;
  switcherWidget.port.emit('toggle-activation', true);
});

switcherWidget.port.emit('addon-init', dpiActivated);

function promptForCustomDpi() {
  let payload = storageService.hasPreset() ? storageService.getCurrentPreset() : 96;
  switcherWidget.port.emit('prompt-for-custom-dpi', payload);
}

function toggleActivation() {
  dpiActivated = !dpiActivated;
  return dpiActivated;
}

exports.switcherWidget = switcherWidget;
