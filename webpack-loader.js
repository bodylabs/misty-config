var util = require('util'),
    path = require('path'),
    _ = require('underscore'),
    recursive = require('recursive-readdir-sync'),
    config = require('./index');

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

    return util.format("module.exports = %s;", JSON.stringify(config));
};
