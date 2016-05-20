var util = require('util'),
    path = require('path'),
    _ = require('underscore'),
    config = require('config');


var substituteEnv = function (config) {

    function _recur(obj) {
        _(obj).forEach(function (v, k) {
            if (_.isString(v)) {
                var match = v.match('^[$]{(.*)}$');

                if (match) {
                    if (! process.env[match[1]]) {
                        throw new Error(util.format('misty-config: %s not set in the environment', v));
                    } else {
                        obj[k] = process.env[match[1]];
                    }
                }
            } else if (_.isObject(v) || _.isArray(v)) {
                _recur(v);
            }
        });
    }
    _recur(config);
};

substituteEnv(config);
config.util.makeImmutable(config);

module.exports = config;
