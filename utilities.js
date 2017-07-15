const FlakeIdGen = require('flake-idgen')
const intformat = require('biguint-format')
const generator = new FlakeIdGen()
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
module.exports.mergeDeep = function(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        module.exports.mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return module.exports.mergeDeep(target, ...sources);
}
module.exports.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
module.exports.pad = function(str, pad) {
  pad = pad  || '0';
  while(str.length < 4) str = pad + str;
  return str;
}
module.exports.genSnowflake = function() {
  let id = generator.next()
  return intformat(id, 'dec')
}
module.exports._ = require('lodash')