'use strict';

const { ActionButton } = require('sdk/ui/button/action');
const data = require('sdk/self').data;
const dpiService = require('../service/dpi');
const storageService = require('../service/storage');

const iconActivatedPath = './widget/images/icon-activated.png'
const iconDeactivatedPath = './widget/images/icon-deactivated.png'

var dpiActivated = storageService.hasPreset();

var mainButton = ActionButton({
    id: 'dpi-switcher',
    label: 'DPI Switcher',
    icon: dpiActivated ? iconActivatedPath : iconDeactivatedPath,
    onClick: handleClick
});

var switcherWidget = require('sdk/panel').Panel({
    width: 230,
    height: 100,
    contentURL: data.url('widget/main.html')
});

function handleClick(state) {
    switcherWidget.show({
      position: mainButton
    });
}

switcherWidget.port.on('left-click', function() {
  if (storageService.hasPreset()) {
    switcherWidget.port.emit('toggle-activation', toggleActivation());
    if (dpiActivated) {
      dpiService.setFontDpi(storageService.getCurrentPreset());
      mainButton.state("window", {
          icon: iconActivatedPath
      });
    } else {
      dpiService.resetToBrowserDefault();
      mainButton.state("window", {
          icon: iconDeactivatedPath
      });
    }
  } else {
    promptForCustomDpi();
  }
});

switcherWidget.port.on('reset-to-browser-default', function() {
    dpiService.resetToBrowserDefault();
    mainButton.state("window", {
        icon: iconDeactivatedPath
    });
});


switcherWidget.port.on('prompt-for-custom-dpi', function() {
    switcherWidget.port.emit('prompt-for-custom-dpi');
});

switcherWidget.port.on('set-current-preset', function(payload) {
  storageService.setCurrentPreset(payload);
  dpiService.setFontDpi(payload);
  dpiActivated = true;
  switcherWidget.port.emit('toggle-activation', true);
  mainButton.state("window", {
      icon: iconActivatedPath
  });
});

switcherWidget.port.emit('addon-init', dpiActivated);

function promptForCustomDpi() {
  let payload = storageService.hasPreset() ? storageService.getCurrentPreset() : -1;
  switcherWidget.port.emit('prompt-for-custom-dpi', payload);
}

function toggleActivation() {
  dpiActivated = !dpiActivated;
  return dpiActivated;
}

exports.widget = switcherWidget;
