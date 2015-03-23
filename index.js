
var _ = require('lodash');
var postcss = require('postcss');
var dictionary = require('./lib/dictionary');

module.exports = function(css, options) {

  var options = options || {};
  options = _.defaults(options, {
  });

  var root = postcss.parse(css);

  var results = {};
  results.rules = [];
  results.warnings = [];

  root.eachRule(function(rule) {
    var x = 0;
    var y = 0;
    var ratio = 0;
    var score = 0;
    var properties = [];

    rule.eachDecl(function(decl) {
      properties.push(decl.prop);
    });

    properties.forEach(function(prop) {
      if (_.indexOf(dictionary.structure, prop) !== -1) {
        x++;
      } else if (_.indexOf(dictionary.skin, prop) !== -1) {
        y++;
      }
    });

    ratio = (x > y) ? y/x : x/y || 0;
    score = ratio * properties.length;

    results.rules.push({
      selector: rule.selector,
      line: rule.source.start.line,
      declarations: {
        structure: x,
        skin: y
      },
      ratio: ratio,
      score: score
    });

    if (score > 6) {
      results.warnings.push({
        selector: rule.selector,
        line: rule.source.start.line,
        message: 'Ruleset has a high mix of property types and a high number of declarations',
        ratio: ratio,
        score: score,
      });
    } else if (ratio > .5) {
      results.warnings.push({
        selector: rule.selector,
        line: rule.source.start.line,
        message: 'Ruleset has a high mix of property types',
        ratio: ratio,
        score: score,
      });
    }

  });

  return results;
};

