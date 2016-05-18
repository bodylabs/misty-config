const util = require('util'),
      path = require('path'),
      _ = require('underscore'),
      recursive = require('recursive-readdir-sync'),
      config = require('./index');

module.exports = function () {

    //
    // At build time, the configs are parsed from hjson to json,
    // cascaded, and the environment variables are resolved.
    //
    // The resulting POJO is inserted into the build.
    //
    var configFiles = recursive(path.join(__dirname, '/../config'));
    configFiles.push(path.resolve('../config/local.hjson'));

    configFiles.forEach(this.addDependency);
    this.cacheable();

    return `module.exports = ${JSON.stringify(config)}`;
};
