
var mocha = require('mocha');
var assert = require('assert');
var mixedProperties = require('..');
var cssnext = require('cssnext');

var basscss = cssnext('@import "basscss"');
var results = mixedProperties(basscss);

describe('css-mixed-properties', function() {

  it('should do something', function() {
    assert.notEqual(typeof results, 'undefined');
  });

  it('should have rules', function() {
    assert(results.rules);
  });

  it('should have warnings', function() {
    assert(results.warnings);
  });

  it('should produce scores', function() {
    results.rules.forEach(function(rule) {
      assert.equal(typeof rule.score, 'number');
    });
  });

});

