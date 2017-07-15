var colors = require('colors/safe')
const config = require('./config/')
var winston = require('winston')
var cycle = require('cycle')
var allColors = winston.config.allColors
function colorize(level) {
  var colorized = level;
  if (allColors[level] instanceof Array) {
    for (var i = 0, l = allColors[level].length; i < l; ++i) {
      colorized = colors[allColors[level][i]](colorized);
    }
  }
  else if (allColors[level].match(/\s/)) {
    var colorArr = allColors[level].split(/\s+/);
    for (var i = 0; i < colorArr.length; ++i) {
      colorized = colors[colorArr[i]](colorized);
    }
    allColors[level] = colorArr;
  }
  else {
    colorized = colors[allColors[level]](colorized);
  }

  return colorized;
}
exports.serialize = function (obj, key) {
  // symbols cannot be directly casted to strings
  if (typeof key === 'symbol') {
    key = key.toString()
  }
  if (typeof obj === 'symbol') {
    obj = obj.toString()
  }

  if (obj === null) {
    obj = 'null';
  }
  else if (obj === undefined) {
    obj = 'undefined';
  }
  else if (obj === false) {
    obj = 'false';
  }

  if (typeof obj !== 'object') {
    return key ? key + '=' + obj : obj;
  }

  if (obj instanceof Buffer) {
    return key ? key + '=' + obj.toString('base64') : obj.toString('base64');
  }

  var msg = '',
      keys = Object.keys(obj),
      length = keys.length;

  for (var i = 0; i < length; i++) {
    if (Array.isArray(obj[keys[i]])) {
      msg += keys[i] + '=[';

      for (var j = 0, l = obj[keys[i]].length; j < l; j++) {
        msg += exports.serialize(obj[keys[i]][j]);
        if (j < l - 1) {
          msg += ', ';
        }
      }

      msg += ']';
    }
    else if (obj[keys[i]] instanceof Date) {
      msg += keys[i] + '=' + obj[keys[i]];
    }
    else {
      msg += exports.serialize(obj[keys[i]], keys[i]);
    }

    if (i < length - 1) {
      msg += ', ';
    }
  }

  return msg;
};
exports.clone = function (obj) {
  //
  // We only need to clone reference types (Object)
  //
  var copy = {};

  if (obj instanceof Error) {
    // With potential custom Error objects, this might not be exactly correct,
    // but probably close-enough for purposes of this lib.
    copy = { message: obj.message };
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      copy[key] = obj[key];
    });

    return copy;
  }
  else if (!(obj instanceof Object)) {
    return obj;
  }
  else if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  for (var i in obj) {
    if (Array.isArray(obj[i])) {
      copy[i] = obj[i].slice(0);
    }
    else if (obj[i] instanceof Buffer) {
      copy[i] = obj[i].slice(0);
    }
    else if (typeof obj[i] != 'function') {
      copy[i] = obj[i] instanceof Object ? exports.clone(obj[i]) : obj[i];
    }
    else if (typeof obj[i] === 'function') {
      copy[i] = obj[i];
    }
  }

  return copy;
};
function formatter(options) {
  let showLevel = options.showLevel === undefined ? true : options.showLevel
  let meta = options.meta !== null && options.meta !== undefined && !(options.meta instanceof Error)
    ? exports.clone(cycle.decycle(options.meta))
    : options.meta || null
  let output = ''
  output += options.label ? ('[' + options.label + '] ') : ''
  if (showLevel) {
    output += colorize(options.level)
  }
  output += (options.align) ? '\t' : ''
  output += (showLevel) ? ': ' : ''
  output += options.message
  if (meta !== null && meta !== undefined) {
    if (meta && meta instanceof Error && meta.stack) {
      meta = meta.stack;
    }

    if (typeof meta !== 'object') {
      output += ' ' + meta;
    }
    else if (Object.keys(meta).length > 0) {
      if (typeof options.prettyPrint === 'function') {
        output += ' ' + options.prettyPrint(meta);
      } else if (options.prettyPrint) {
        output += ' ' + '\n' + util.inspect(meta, false, options.depth || null, options.colorize);
      } else if (
        options.humanReadableUnhandledException
        && Object.keys(meta).length === 5
        && meta.hasOwnProperty('date')
        && meta.hasOwnProperty('process')
        && meta.hasOwnProperty('os')
        && meta.hasOwnProperty('trace')
        && meta.hasOwnProperty('stack')) {

        //
        // If meta carries unhandled exception data serialize the stack nicely
        //
        var stack = meta.stack;
        delete meta.stack;
        delete meta.trace;
        output += ' ' + exports.serialize(meta);

        if (stack) {
          output += '\n' + stack.join('\n');
        }
      } else {
        output += ' ' + exports.serialize(meta);
      }
    }
  }
  return output
}
exports.testContainer = function(l) {
  l.error('Error')
  l.warn('Warn')
  l.info('Info')
  l.verbose('Verbose')
  l.debug('Debug')
  l.silly('Silly')
}
winston.loggers.add('rest', {
  console: {
    level: config.env.startsWith('dev') ? 'debug' : 'info',
    colorize: true,
    label: colors['cyan']('rest'),
    formatter: formatter,
    align: true
  }
})
winston.loggers.add('websocket', {
  console: {
    level: config.env.startsWith('dev') ? 'debug' : 'info',
    colorize: true,
    label: colors['green']('ws'),
    formatter: formatter,
    align: true
  }
})
winston.loggers.add('database', {
  console: {
    level: config.env.startsWith('dev') ? 'debug' : 'info',
    colorize: true,
    label: colors['magenta']('db'),
    formatter: formatter,
    align: true
  }
})
winston.loggers.add('main', {
  console: {
    level: config.env.startsWith('dev') ? 'debug' : 'info',
    colorize: true,
    formatter: formatter,
    align: true
  }
})