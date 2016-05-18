const util = require('util'),
      path = require('path'),
      _ = require('underscore'),
      config = require('config');


config.util.substituteEnv = function (config) {
    var decoratedEnvironment =
        _.object(_(process.env).map(function (v, k) {
            return [util.format("${%s}", k), v];
        }));
    config.util.substituteDeep(decoratedEnvironment, config);
};
config.util.substituteEnv(config);
config.util.makeImmutable(config);

module.exports = config;
