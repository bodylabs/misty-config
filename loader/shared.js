var path = require('path');
var recursive = require('recursive-readdir-sync');
var util = require('util');

var findConfigurationFiles = function () {
    // Find the config directory the same way as `node-config` does it
    // We exclude checking for a command line argument because this will never be
    // invoked that way:
    CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.join(process.cwd(), 'config');
    if (CONFIG_DIR.indexOf('.') === 0) {
        CONFIG_DIR = path.join(process.cwd(), CONFIG_DIR);
    }
    // Declare all config file present as dependencies...
    var existingConfigs = recursive(CONFIG_DIR);

    // ...as well as all possible local files, since they could be
    // added at any moment
    var extNames = ['js', 'json', 'json5', 'hjson', 'toml',
                    'coffee', 'iced', 'yaml', 'yml', 'cson', 'properties',];

    var localConfigs = extNames.map(function (ext) {
        return path.resolve(CONFIG_DIR, 'local.' + ext);
    });

    return existingConfigs.concat(localConfigs);
};

var exportJSONConstant = function (obj) {
    return util.format("module.exports = %s;", JSON.stringify(obj));
};

module.exports = {
    findConfigurationFiles: findConfigurationFiles,
    exportJSONConstant: exportJSONConstant,
};
