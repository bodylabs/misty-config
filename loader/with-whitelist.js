var get = require('lodash/get');
var has = require('lodash/has');
var loaderUtils = require('loader-utils');
var set = require('lodash/set');

var config = require('../index');
var shared = require('./shared');

var isArray = require('lodash/isArray');

var applyWhitelist = function (config, whitelist) {
    if (! isArray(whitelist)) {
        throw new Error('No config property whitelist was specified! ' +
            'To use misty-config as a webpack loader you must specify a whitelist as a query parameter.');
    }

    var whitelistReducer = function (obj, path) {
        if (has(config, path)) {
            set(obj, path, get(config, path));
        }
        return obj;
    };

    var whitelistedConfig = whitelist.reduce(whitelistReducer, {});

    return whitelistedConfig;
};

module.exports = function () {
    var query = loaderUtils.parseQuery(this.query);

    var whitelistedConfig = applyWhitelist(config, query.whitelist);

    shared.findConfigurationFiles().forEach(this.addDependency);

    this.cacheable();

    return shared.exportJSONConstant(whitelistedConfig);
};
