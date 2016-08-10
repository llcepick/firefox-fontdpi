'use strict';

const { ActionButton } = require('sdk/ui/button/action');
const data = require('sdk/self').data;
const dpiService = require('../service/dpi');
const storageService = require('../service/storage');

const iconActivatedPath16 = './widget/images/icon-activated16.png'
const iconDeactivatedPath16 = './widget/images/icon-deactivated16.png'
const iconActivatedPath24 = './widget/images/icon-activated24.png'
const iconDeactivatedPath24 = './widget/images/icon-deactivated24.png'
const iconActivatedPath32 = './widget/images/icon-activated32.png'
const iconDeactivatedPath32 = './widget/images/icon-deactivated32.png'
const iconActivatedPath64 = './widget/images/icon-activated64.png'
const iconDeactivatedPath64 = './widget/images/icon-deactivated64.png'
const iconConfigPath16 = './widget/images/icon-Config16.png'
const iconConfigPath24 = './widget/images/icon-Config24.png'
const iconConfigPath32 = './widget/images/icon-Config32.png'
const iconConfigPath64 = './widget/images/icon-Config64.png'


var dpiActivated = storageService.hasPreset();

var mainButton = ActionButton({
    id: 'dpi-switcher',
    label: 'DPI Switcher',
    icon: dpiActivated ? {
		"16":iconActivatedPath16,
		"24":iconActivatedPath24,
		"32":iconActivatedPath32,
		"64":iconActivatedPath64 
		} : {
		"16":iconDeactivatedPath16,
		"24":iconDeactivatedPath24,
		"32":iconDeactivatedPath32,
		"64":iconDeactivatedPath64
		},
    onClick: handleClick,
});

var configButton = ActionButton({
    id: 'dpi-switcher-config',
    label: 'DPI Switcher Configuration',
    icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		} ,
    onClick: handleConfigClick,
});


var switcherWidget = require('sdk/panel').Panel({
    width: 230,
    height: 100,
    contentURL: data.url('widget/main.html')
});

function handleContextMenu(state) {
    switcherWidget.show({
      position: mainButton
    });
}

function handleConfigClick(state) {
	switcherWidget.show({
      position: configButton
    });
}

function handleClick(state) {
    if (storageService.hasPreset()) {
    switcherWidget.port.emit('toggle-activation', toggleActivation());
    if (dpiActivated) {
      dpiService.setFontDpi(storageService.getCurrentPreset());
      mainButton.state("window", {
          icon: {
          "16":iconActivatedPath16,
          "24":iconActivatedPath24,
          "32":iconActivatedPath32,
          "64":iconActivatedPath64 
          }
      });
	  configButton.state("window", {
		icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		}
	  });
    } else {
      dpiService.resetToBrowserDefault();
      mainButton.state("window", {
          icon: {
          "16":iconDeactivatedPath16,
          "24":iconDeactivatedPath24,
          "32":iconDeactivatedPath32,
          "64":iconDeactivatedPath64
          }
      });
	  configButton.state("window", {
		icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		}
	  });
    }
  } else {
    promptForCustomDpi();
  }
}


switcherWidget.port.on('left-click', function() {
  if (storageService.hasPreset()) {
    switcherWidget.port.emit('toggle-activation', toggleActivation());
    if (dpiActivated) {
      dpiService.setFontDpi(storageService.getCurrentPreset());
      mainButton.state("window", {
          icon: {
          "16":iconActivatedPath16,
          "24":iconActivatedPath24,
          "32":iconActivatedPath32,
          "64":iconActivatedPath64
          }
      });
	  configButton.state("window", {
		icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		}
	  });
    } else {
      dpiService.resetToBrowserDefault();
      mainButton.state("window", {
          icon: {
          "16":iconDeactivatedPath16,
          "24":iconDeactivatedPath24,
          "32":iconDeactivatedPath32,
          "64":iconDeactivatedPath64
          }
      });
	  configButton.state("window", {
		icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		}
	  });
    }
  } else {
    promptForCustomDpi();
  }
});

switcherWidget.port.on('reset-to-browser-default', function() {
    dpiService.resetToBrowserDefault();
    mainButton.state("window", {
        icon: {
        "16":iconDeactivatedPath16,
        "24":iconDeactivatedPath24,
        "32":iconDeactivatedPath32,
        "64":iconDeactivatedPath64
        }
    });
	configButton.state("window", {
		icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		}
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
      icon: {
      "16":iconActivatedPath16,
      "24":iconActivatedPath24,
      "32":iconActivatedPath32,
      "64":iconActivatedPath64
      }
  });
  configButton.state("window", {
		icon: {
		"16":iconConfigPath16,
		"24":iconConfigPath24,
		"32":iconConfigPath32,
		"64":iconConfigPath64 
		}
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
