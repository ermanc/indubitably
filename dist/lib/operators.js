'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _helpersHamlet = require('../helpers/hamlet');

var _helpersHamlet2 = _interopRequireDefault(_helpersHamlet);

function or() {
  for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
    list[_key] = arguments[_key];
  }

  // TODO: Return the first value that parses, instead of
  // parsing all and then deciding.
  return function (input, continuation) {
    var firstValid = (0, _lodash.find)((0, _lodash.map)(list, function (schema) {
      return (0, _helpersHamlet2['default'])(function () {
        return continuation(input, schema);
      });
    }), _lodash.identity);

    return firstValid || null;
  };
}

function ensure(schema) {
  for (var _len2 = arguments.length, conditions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    conditions[_key2 - 1] = arguments[_key2];
  }

  return function (input, continuation) {
    var parsed = continuation(input, schema);
    var isValid = every(conditions, function (condition) {
      return condition(parsed);
    });

    return isValid ? parsed : null;
  };
}

exports.or = or;
exports.ensure = ensure;