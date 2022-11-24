(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bundleName = {}, global._));
})(this, (function (exports, lodash) { 'use strict';

  var name = 'Tom';

  console.log('11111');
  var name11 = 'name-Tom';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "body {\n  background-color: blue;\n}";
  styleInject(css_248z);

  console.log('name: ', name, name11, lodash.isArray({}));
  var sum = function (a, b) { return a + b; };
  var dins = function (a, b) { return a - b; };

  exports.dins = dins;
  exports.sum = sum;

}));
