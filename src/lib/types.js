import moment from 'moment';
import { first, find, isEmpty, isFunction, identity } from 'lodash';

import * as parsers from  './parsers';

function _validate(value, validators) {
  if (!value) {
    return null;
  }
  else if (isEmpty(validators)) {
    return value;
  }

  const valid = find(validators, (validator) => {
    return isFunction(validator) ?
      validator(value) :
      validator === value;
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
  const isValidatorCall = (
    validators.length === 2 &&
    !isFunction(validators[0]) &&
    isFunction(validators[1])
  );

  if (isValidatorCall) {
    return _validate(parser(first(validators)), []);
  }
  else {
    return (input) => _validate(parser(input), validators);
  }
}

function decimal(...validators) {
  return _type(parsers.parseDecimal, validators);
}

function integer(...validators) {
  return _type(parsers.parseInteger, validators);
}

function dateTime(...validators) {
  return _type(parsers.parseDateTime, validators);
}

function date(...validators) {
  return _type(parsers.parseDate, validators);
}

function string(...validators) {
  return _type(parsers.parseString, validators);
}

function bool(...validators) {
  return _type(parsers.parseBoolean, validators);
}

function any(...validators) {
  return _type(identity, validators);
}

export {
  decimal,
  integer,
  dateTime,
  date,
  string,
  bool,
  any
};
