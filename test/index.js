var fs = require('fs');
var util = require('util');
var test = require('tape');
var bakeoff = require('../lib');
var helper = require('./helper');

// speed up for tests
bakeoff.options.max = 5;
bakeoff.options.step = 100;

test('attempts failing 3 times then succeed (using callback)', function(t) {
  t.plan(2);
  bakeoff(helper.failThenSucceed(3), function(err, res) {
    t.equal(err, null);
    t.notEqual(res, null);
  });
});

test('attempts failing 4 times then succeed (using promise)', function(t) {
  t.plan(1);
  bakeoff(helper.failThenSucceed(4)).then(function(res) {
    t.notEqual(res, null);
  });
});

test('attempts failing 5 times and not succeed (using promise)', function(t) {
  t.plan(1);
  bakeoff(helper.failThenSucceed(5)).catch(function(err) {
    t.notEqual(err, null);
  });
});

test('use a method in function with cb (using callback)', function(t) {
  t.plan(2);
  bakeoff(function(cb) {
    fs.readFile('/etc/passwd', cb);
  }, function(err, res) {
    t.equal(err, null);
    t.notEqual(res, null);
  });
});

test('use method directly with parameter (using promise)', function(t) {
  t.plan(1);
  bakeoff(fs.readFile, '/etc/passwd').then(function(res) {
    t.notEqual(res, null);
  });
});

test('use method directly with parameters (using promise)', function(t) {
  t.plan(1);
  bakeoff(fs.readFile, ['/etc/passwd', 'utf8']).then(function(res) {
    t.notEqual(res, null);
  });
});