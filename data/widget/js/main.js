'use strict';

addon.port.on('addon-init', function (activated) {
  toggleActivation(activated);
});

function init() {
  var switcherButton = document.getElementById('switcherButton');

  addon.port.on('toggle-activation', function (activated) {
    toggleActivation(activated);
  });

  addon.port.on('prompt-for-custom-dpi', function (payload) {
    var texts = [
      '* ERROR: Please enter only positive integer value',
      'Enter your desired font DPI.',
      'Most system default is 96. Set a higher number to enlarge the font'
    ];

    var value = prompt(texts.slice(1).join('\n'), payload);
    while (value != null && !isPositiveInteger(value)) {
      value = prompt(texts.join('\n'), value);
    }

    if (value != null) {
      addon.port.emit('set-current-preset', value);
    }
  });

  switcherButton.addEventListener('click', function (event) {
    addon.port.emit('left-click');
    event.preventDefault();
  }, true);


  var resetButton = document.getElementById('resetButton');

  resetButton.addEventListener('click', function (event) {
    if (window.confirm('Do you really want to reset the DPI to default value?')) {
        addon.port.emit('reset-to-browser-default');
        toggleActivation(false);
    }
    event.preventDefault();
  }, true);


  var promptButton = document.getElementById('promptForDPI');

  promptButton.addEventListener('click', function (event) {
    addon.port.emit('prompt-for-custom-dpi');
    event.preventDefault();
  }, true);
}

function isPositiveInteger(value) {
  return /^\+?[1-9]\d*$/.test(value);
}

function toggleActivation(activated) {
  var switcherButton = document.getElementById('switcherButton');
  switcherButton.checked = activated;
}
