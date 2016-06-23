var util = require('util');

var config = require('../index');
var shared = require('./shared');

//
// At build time, the configs are parsed from hjson to json,
// cascaded, and the environment variables are resolved.
//
// The resulting POJO is inserted into the build.
//
module.exports = function () {

    shared.findConfigurationFiles().forEach(this.addDependency);

    this.cacheable();

    return shared.exportJSONConstant(config);
};
