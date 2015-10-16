import { find, every, map, identity } from 'lodash';

import h from '../helpers/hamlet';

function or(...list) {
  // TODO: Return the first value that parses, instead of
  // parsing all and then deciding.
  return (input, continuation) => {
    const firstValid = find(
      map(list, (schema) => h(() => continuation(input, schema))),
      identity
    );

    return firstValid || null
  }
}

function ensure(schema, ...conditions) {
  return (input, continuation) => {
    const parsed = continuation(input, schema)
    const isValid = every(conditions, (condition) => condition(parsed));

    return isValid ? parsed : null;
  }
}

export {
  or,
  ensure
};
