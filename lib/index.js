require('es6-promise').polyfill();

var debug = require('debug')('bakeoff');

// public

var bakeoff = module.exports = mainFn;

bakeoff.options = {
  max: 10,
  step: 1000 // ms
};

// private

function mainFn(fn /*, params, done*/) {
  if (arguments.length === 0) {
    throw new Error('At least a function should be specified.');
  }

  var args = parseArgs.apply(this, arguments);

  return new Promise(function(resolve, reject) {
    doAttempts(fn, args.params, function(err, res) {
      if (args.done) {
        args.done(err, res);
      }
      if (err) {
        reject(err);
      }
      else {
        resolve(res);
      }
    });
  });
}

function parseArgs() {
  var parsed = {
    params: [],
    done: null
  };

  var args = Array.prototype.slice.call(arguments, 1);

  if (args.length === 1) {
    if (typeof args[0] === 'function') {
      parsed.done = args[0];
    } else if (typeof args[0] === 'string') {
      parsed.params.push(args[0]);
    } else {
      parsed.params = args[0];
    }
  } else if (args.length >= 2) {
    parsed.params = args[0];
    parsed.done = args[1];
  }

  return parsed;
}

function doAttempts(fn, params, done) {
  var attempt = 1;

  var work = function() {
    debug('attempt #' + attempt + ' of ' + bakeoff.options.max);
    var cb = function(err, res) {
      debug('attempt #' + attempt + (err ? ' failed' : ' succeeded'));
      if (!err) {
        return done(err, res);
      } else {
        attempt++;
        if (attempt <= bakeoff.options.max) {
          var interval = genInterval(attempt, bakeoff.options.step);
          debug('attempt #' + attempt + ' in ' + interval + 'ms');
          setTimeout(work, interval);
        } else {
          debug('no more attempts');
          return done(err);
        }
      }
    };
    params.push(cb);
    fn.apply(this, params);
  };

  work();
}

function genInterval(attempt, step) {
  var min = (attempt - 1) * step;
  var max = attempt * step;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
