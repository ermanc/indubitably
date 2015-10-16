import _, { partial, contains } from 'lodash';
import moment from 'moment';

function isInteger(value) {
    if (Number.isInteger) {
      return Number.isInteger(value);
    }
    else {
      // Polyfill code from MDN
      return typeof value === "number" &&
             isFinite(value) &&
             Math.floor(value) === value;
    }
};

function parseDecimal(input) {
  const number = Number(input);
  const valid = number && !isInteger(number);

  return valid ? number : null;
}

function parseInteger(input) {
  const number = Number(input);
  const valid =  number && isInteger(number);

  return valid ? number : null;
}

function parseString(input) {
  const valid = typeof input === 'string'

  return valid ? input : null;
}

function parseBoolean(input) {
  const valid = input === true || input === false;

  return valid ? input : null;
}

function _parseMoment(input, validPatterns) {
  const datetime = moment(input);
  const valid = datetime.isValid && contains(validPatterns, res._f);

  return valid ? datetime : null;
}

const parseDateTime = partial(_parseMoment, _, [
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss.SSSSZ'
]);

const parseDate = partial(_parseMoment, _, [
  'YYYY-MM-DD'
]);

export {
  parseDecimal,
  parseInteger,
  parseString,
  parseBoolean,
  parseDateTime,
  parseDate,
};
