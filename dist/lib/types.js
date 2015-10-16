'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _parsers = require('./parsers');

var parsers = _interopRequireWildcard(_parsers);

function _validate(value, validators) {
  if (!value) {
    return null;
  } else if ((0, _lodash.isEmpty)(validators)) {
    return value;
  }

  var valid = (0, _lodash.find)(validators, function (validator) {
    return (0, _lodash.isFunction)(validator) ? validator(value) : validator === value;
  });

  return valid ? value : null;
}

function _type(parser, validators) {
  // If the call signature is (non-function, function) we are being
  // called by the validator; validate and return immediately.
  //
  // Else, we're in factory mode, return the validator function
  // to be called later by the validator
  //
  // This enables the usage:
  // {
  //   uuid:     string((s) => s.length === 32)
  //   gender:   string('male', 'female'),
  //   name:     string
  //   location: or(
  //     {
  //       type:   'address',
  //       street: string,
  //       house:  string,
  //       zip:    string((s) => s.length === 5)
  //     },
  //     {
  //       type:      'coordinates',
  //       latitude:  string,
  //       longitude: string
  //     },
  //   )
  // }
  var isValidatorCall = validators.length === 2 && !(0, _lodash.isFunction)(validators[0]) && (0, _lodash.isFunction)(validators[1]);

  if (isValidatorCall) {
    return _validate(parser((0, _lodash.first)(validators)), []);
  } else {
    return function (input) {
      return _validate(parser(input), validators);
    };
  }
}

function decimal() {
  for (var _len = arguments.length, validators = Array(_len), _key = 0; _key < _len; _key++) {
    validators[_key] = arguments[_key];
  }

  return _type(parsers.parseDecimal, validators);
}

function integer() {
  for (var _len2 = arguments.length, validators = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    validators[_key2] = arguments[_key2];
  }

  return _type(parsers.parseInteger, validators);
}

function dateTime() {
  for (var _len3 = arguments.length, validators = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    validators[_key3] = arguments[_key3];
  }

  return _type(parsers.parseDateTime, validators);
}

function date() {
  for (var _len4 = arguments.length, validators = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    validators[_key4] = arguments[_key4];
  }

  return _type(parsers.parseDate, validators);
}

function string() {
  for (var _len5 = arguments.length, validators = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    validators[_key5] = arguments[_key5];
  }

  return _type(parsers.parseString, validators);
}

function bool() {
  for (var _len6 = arguments.length, validators = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    validators[_key6] = arguments[_key6];
  }

  return _type(parsers.parseBoolean, validators);
}

function any() {
  for (var _len7 = arguments.length, validators = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    validators[_key7] = arguments[_key7];
  }

  return _type(_lodash.identity, validators);
}

exports.decimal = decimal;
exports.integer = integer;
exports.dateTime = dateTime;
exports.date = date;
exports.string = string;
exports.bool = bool;
exports.any = any;