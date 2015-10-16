'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  } else {
    // Polyfill code from MDN
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
};

function parseDecimal(input) {
  var number = Number(input);
  var valid = number && !isInteger(number);

  return valid ? number : null;
}

function parseInteger(input) {
  var number = Number(input);
  var valid = number && isInteger(number);

  return valid ? number : null;
}

function parseString(input) {
  var valid = typeof input === 'string';

  return valid ? input : null;
}

function parseBoolean(input) {
  var valid = input === true || input === false;

  return valid ? input : null;
}

function _parseMoment(input, validPatterns) {
  var datetime = (0, _moment2['default'])(input);
  var valid = datetime.isValid && (0, _lodash.contains)(validPatterns, res._f);

  return valid ? datetime : null;
}

var parseDateTime = (0, _lodash.partial)(_parseMoment, _lodash2['default'], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss.SSSSZ']);

var parseDate = (0, _lodash.partial)(_parseMoment, _lodash2['default'], ['YYYY-MM-DD']);

exports.parseDecimal = parseDecimal;
exports.parseInteger = parseInteger;
exports.parseString = parseString;
exports.parseBoolean = parseBoolean;
exports.parseDateTime = parseDateTime;
exports.parseDate = parseDate;