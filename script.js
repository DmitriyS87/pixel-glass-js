// TODO
// 1. Сохранять настройки
// 2. Сделать выключение подложки
// 3. Сделать контролы кнопками
// 4. Если показ выключен, изменение любой опции включает

function pixelGlass() {

  'use strict';

  console.log('hello');

  var doc = document;
  var controlsPanel;
  var bodyContentWrapper;
  var panelClass = 'controls-panel';

  var prefix = 'pg';
  var filtersList = ['none', 'invert'];
  var statesList = ['off', 'on'];

  var currents = {
    state: getCurrent('state', statesList[1]),
    filter: getCurrent('filter', filtersList[0]),
    opacity: getCurrent('opacity', getBodyOpacity())
  };

  var targets = {
    state: {
      elem: doc.documentElement,
      attr: 'data'
    },
    filter: {
      elem: doc.body,
      attr: 'data'
    },
    opacity: {
      elem: doc.body,
      attr: 'style'
    }
  };

  // States switcher params
  var paramsStates = {
    elemTag: 'button',
    elemText: 'on',
    listName: 'states',
    itemName: 'state',
    target: targets['state'],
    type: 'button',
    list: statesList,
    attrs: {
      tabindex: 1,
    }
  };

  // Filters switcher params
  var paramsFilters = {
    elemTag: 'button',
    elemText: 'invert',
    listName: 'filters',
    itemName: 'filter',
    target: targets['filter'],
    type: 'button',
    list: filtersList,
    attrs: {
      tabindex: 2,
    }
  };

  // Opacity range params
  var paramsOpacity = {
    itemName: 'opacity',
    type: 'number',
    target: targets['opacity'],
    setAttr: 'style',
    attrs: {
      min: 0,
      max: 1,
      step: 0.1,
      tabindex: 3,
    }
  };

  init();

  //---------------------------------------------

  function getCurrent(name, defaultValue) {
    var itemName = [prefix, name].join('-');
    var localStorageVal = localStorage[ itemName ];
    return localStorageVal ? localStorageVal : defaultValue;
  }

  //---------------------------------------------

  function saveLocalStorage(name, value) {
    var itemName = [prefix, name].join('-');
    localStorage[itemName] = value;
  }

  //---------------------------------------------

  function getBodyOpacity() {
    var opacityStr = getComputedStyle(doc.body).opacity;
    return +opacityStr;
  }

  //---------------------------------------------

  function init() {
    addExternalCSS();
    applyCurrents();
    createContolsPanel();
  }

  //---------------------------------------------

  function applyCurrents() {
    for (var key in targets ) {
      var target = targets[ key ];
      var current = currents[ key ];

      if (target.attr === 'data') {
        target.elem.dataset[ key ] = current;
      }
      else if (target.attr === 'style') {
        target.elem.style[ key ] = current;
      }
    }
  }

  //---------------------------------------------

  function createContolsPanel() {
    controlsPanel = doc.createElement('div');
    controlsPanel.classList.add(panelClass);
    doc.documentElement.appendChild(controlsPanel);

    initControls()
  }

  //---------------------------------------------

  function initControls() {
    createButton(paramsStates);
    createButton(paramsFilters);
    createInputNumber(paramsOpacity);

    createDragButton();
  }

  //---------------------------------------------

  function createButton(params) {
    var listName = params.listName;
    var itemName = params.itemName;
    var elemTag = params.elemTag;
    var elemText = params.elemText;
    var type = params.type;
    var list = params.list;
    var action = params.action;
    var currentVal = currents[itemName];
    var attrs = params.attrs;
    var currentNum = list.indexOf(currentVal);

    var id = itemName;
    var input = doc.createElement(elemTag);
    input.classList.add(panelClass + '__control', panelClass + '__control--' + type);
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    input.dataset['stateNum'] = currentNum;

    if ( attrs ) {
      for (var attr in attrs) {
        input.setAttribute(attr, attrs[attr]);
      }
    }

    if (elemTag === 'button') {
      input.innerHTML = elemText;
    }

    controlsPanel.appendChild(input);

    input.onclick = function() {
      if (!params.target) {
        return;
      }

      currentNum = +!currentNum;
      currentVal = list[currentNum];

      input.dataset['stateNum'] = currentNum;
      params.target.elem.dataset[itemName] = currentVal;
      saveLocalStorage(itemName, currentVal);
    };
  }

  //---------------------------------------------

  function createInputNumber(params) {
    var itemName = params.itemName;
    var attrs = params.attrs;
    var type = params.type;
    var setAttr = params.setAttr;

    var id = itemName;
    var input = doc.createElement('input');
    input.classList.add(panelClass + '__control', panelClass + '__control--' + type);
    input.setAttribute('type', type);
    input.setAttribute('id', id);

    for (var attr in attrs) {
      input.setAttribute(attr, attrs[attr]);
    }
    input.setAttribute('value', currents[itemName]);

    controlsPanel.appendChild(input);

    input.oninput = function() {
      if (setAttr === 'style') {
        params.target.elem.style[itemName] = this.value;
        saveLocalStorage(itemName, this.value);
      }
    };
  }

  //---------------------------------------------

  function createDragButton() {
    var input = doc.createElement('button');
    input.classList.add(panelClass + '__control', panelClass + '__control--drag-n-drop');
    input.setAttribute('type', 'button');

    controlsPanel.appendChild(input);

    // console.dir(controlsPanel);

    input.onclick = function ( ev ) {
      var x = (ev.clientX)+ 'px';
      var y = ev.clientY + 'px';

      // console.log('x: ',x, 'y: ',y);

      controlsPanel.style['left'] = x;
      controlsPanel.style['top'] = y;

      // console.log( 'left: ',controlsPanel.style.left );
      // console.log( 'top: ',controlsPanel.style.top );
    }
  }

  //---------------------------------------------

  function addExternalCSS() {
    var styleElem = doc.createElement('style');
    var cssLink = doc.createElement('link');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('href', '../pixel-glass-js/styles.css');

    doc.head.appendChild(cssLink);
  }

  //---------------------------------------------
}

window.onload = function () {
  pixelGlass();
}
