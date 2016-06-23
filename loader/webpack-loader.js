var get = require('lodash/get');
var has = require('lodash/has');
var isArray = require('lodash/isArray');
var loaderUtils = require('loader-utils');
var path = require('path');
var recursive = require('recursive-readdir-sync');
var set = require('lodash/set');
var util = require('util');

var config = require('./index');

//
// At build time, the configs are parsed from hjson to json,
// cascaded, and the environment variables are resolved.
//
// The resulting POJO is inserted into the build.
//
module.exports = function () {

    // Find the config directory the same way as `node-config` does it:
    CONFIG_DIR = config.util.initParam('NODE_CONFIG_DIR', path.join(process.cwd(), 'config'));
    if (CONFIG_DIR.indexOf('.') === 0) {
        CONFIG_DIR = path.join(process.cwd(), CONFIG_DIR);
    }

    // Declare all config file present as dependencies...
    recursive(CONFIG_DIR).forEach(this.addDependency);

    // ...as well as all possible local file, since they could be
    // added any moment
    var extNames = ['js', 'json', 'json5', 'hjson', 'toml',
                    'coffee', 'iced', 'yaml', 'yml', 'cson', 'properties',];
    for (ext of extNames) {
        var filename = path.resolve(CONFIG_DIR, 'local.' + ext);
        this.addDependency(filename);
    }

    this.cacheable();

    var query = loaderUtils.parseQuery(this.query);

    if (! isArray(query.whitelist)) {
        throw new Error('No config property whitelist was specified! ' +
            'To use misty-config as a webpack loader you must specify a whitelist as a query parameter.');
    }

    var whitelistReducer = function (obj, path) {
        if (has(config, path)) {
            set(obj, path, get(config, path));
        }
        return obj;
    };

    var whitelistedConfig = query.whitelist.reduce(whitelistReducer, {});

    return util.format("module.exports = %s;", JSON.stringify(whitelistedConfig));
};
