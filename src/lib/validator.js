import _, {
  isObject,
  isFunction,
  isArray,
  find,
  contains,
  partial,
  keys,
  first,
  difference,
  every,
  map,
  compact,
  each
} from 'lodash';

function areValue(...values) {
  return every(values, (value) => typeof value !== 'undefined' && value !== null);
}

function areArray(...values) {
  return every(values, isArray);
}

function areHash(...values) {
  return every(values, (value) => isObject(value) && !areArray(value) && !isFunction(value));
}

function convertHash(hash, converter) {
  let newHash = {};
  each(hash, (value, key) => {
    const newValue = converter(value, key);
    if (areValue(newValue)) {
      newHash[key] = newValue;
    }
  });
  return newHash;
}

function convertArray(array, converter) {
  let newArray = [];
  each(array, (value, index) => {
    const newValue = converter(value, index);
    newArray.push(newValue);
  });
  return newArray;
}

function keyedSchema(schema, key) {
  if (!areValue(schema, key)) {
    return null;
  }

  return (
    schema[key] ||
    schema[key + '?'] ||
    schema[find(keys(schema), (k) => first(k) === ':')]
  );
}

function validator(input, schema, path = []) {
  if (!areValue(input, schema)) {
    return null;
  }
  else if (areHash(input, schema)) {
    const newHash = convertHash(input, (value, key) => {
      const keySchema = keyedSchema(schema, key);
      return validator(value, keySchema, path.concat(key));
    });

    const missingKeys = difference(keys(schema), keys(newHash));
    const missingRequiredKeys = find(missingKeys, (k) => first(k) !== ':' && last(k) !== '?');
    if (missingRequiredKeys) {
      throw new Error(
        'Schema error: Missing required data:' + JSON.stringify({
          missingKeys: missingRequiredKeys,
          foundKeys: keys(newHash),
          foundInPath: `/${path.join('/')}`
        })
      );
    }
    else {
      return newHash;
    }
  }
  else if (areArray(input, schema)) {
    const newArray = convertArray(input, (value, index) =>
      validator(value, first(schema), path.concat(index))
    );

    if (contains(newArray, null)) {
      // Null values in newArray indicate schema/parsing failures
      // Find out which values ended up "null" from input
      const invalidValues = compact(
        map(newArray, (val, i) =>
          val === null ? input[i] : null
        )
      );
      throw new Error(
        'Schema error: Invalid inputs:' + JSON.stringify({
          invalidValues: invalidValues,
          foundInPath: `/${path.join('/')}`
        })
      );
    } else {
      return newArray;
    }
  }
  else if (isFunction(schema)) {
    return schema(input, partial(validator, _, _, path));
  }
  else {
    return input === schema ? input : null;
  }
}

export default validator;
