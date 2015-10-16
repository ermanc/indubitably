'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function areValue() {
  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return (0, _lodash.every)(values, function (value) {
    return typeof value !== 'undefined' && value !== null;
  });
}

function areArray() {
  for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }

  return (0, _lodash.every)(values, _lodash.isArray);
}

function areHash() {
  for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    values[_key3] = arguments[_key3];
  }

  return (0, _lodash.every)(values, function (value) {
    return (0, _lodash.isObject)(value) && !areArray(value) && !(0, _lodash.isFunction)(value);
  });
}

function convertHash(hash, converter) {
  var newHash = {};
  (0, _lodash.each)(hash, function (value, key) {
    var newValue = converter(value, key);
    if (areValue(newValue)) {
      newHash[key] = newValue;
    }
  });
  return newHash;
}

function convertArray(array, converter) {
  var newArray = [];
  (0, _lodash.each)(array, function (value, index) {
    var newValue = converter(value, index);
    newArray.push(newValue);
  });
  return newArray;
}

function keyedSchema(schema, key) {
  if (!areValue(schema, key)) {
    return null;
  }

  return schema[key] || schema[key + '?'] || schema[(0, _lodash.find)((0, _lodash.keys)(schema), function (k) {
    return (0, _lodash.first)(k) === ':';
  })];
}

function validator(input, schema) {
  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  if (!areValue(input, schema)) {
    return null;
  } else if (areHash(input, schema)) {
    var newHash = convertHash(input, function (value, key) {
      var keySchema = keyedSchema(schema, key);
      return validator(value, keySchema, path.concat(key));
    });

    var missingKeys = (0, _lodash.difference)((0, _lodash.keys)(schema), (0, _lodash.keys)(newHash));
    var missingRequiredKeys = (0, _lodash.find)(missingKeys, function (k) {
      return (0, _lodash.first)(k) !== ':' && last(k) !== '?';
    });
    if (missingRequiredKeys) {
      throw new Error('Schema error: Missing required data:' + JSON.stringify({
        missingKeys: missingRequiredKeys,
        foundKeys: (0, _lodash.keys)(newHash),
        foundInPath: '/' + path.join('/')
      }));
    } else {
      return newHash;
    }
  } else if (areArray(input, schema)) {
    var newArray = convertArray(input, function (value, index) {
      return validator(value, (0, _lodash.first)(schema), path.concat(index));
    });

    if ((0, _lodash.contains)(newArray, null)) {
      // Null values in newArray indicate schema/parsing failures
      // Find out which values ended up "null" from input
      var invalidValues = (0, _lodash.compact)((0, _lodash.map)(newArray, function (val, i) {
        return val === null ? input[i] : null;
      }));
      throw new Error('Schema error: Invalid inputs:' + JSON.stringify({
        invalidValues: invalidValues,
        foundInPath: '/' + path.join('/')
      }));
    } else {
      return newArray;
    }
  } else if ((0, _lodash.isFunction)(schema)) {
    return schema(input, (0, _lodash.partial)(validator, _lodash2['default'], _lodash2['default'], path));
  } else {
    return input === schema ? input : null;
  }
}

exports['default'] = validator;
module.exports = exports['default'];