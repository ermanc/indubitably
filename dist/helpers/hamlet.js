/**
@method hamlet
@description Exception wrapper for dangerous single value lookups with defaults
@param {Function} Dangerous lookup code (e.g. object1.field4.subfield2 w/ 'null' field4)
@param {Any} Default value to return in case of exception or undefined
@returns {Any} Value if success, default if error
**/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function hamlet(dangerousCode, defaultValue) {
  var value = undefined;
  try {
    value = dangerousCode(); // to be...
  } catch (e) {
    value = defaultValue; // ...or not to be
  }

  return typeof value !== 'undefined' ? value : defaultValue;
}

exports['default'] = hamlet;
module.exports = exports['default'];