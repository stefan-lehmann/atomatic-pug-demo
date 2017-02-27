'use strict';

var
  browserSync = require('browser-sync'),
  instanceName = require(`${process.cwd()}/package.json`).name,

  createInstance = function(name) {
  console.log('create', instanceName);
    return browserSync.create(name || instanceName);
  },

  getInstance = function(name) {
    if (!browserSync.has( name || instanceName )) {
      return createInstance(name);
    }
    return browserSync.get(name || instanceName)
  }


module.exports.createInstance = createInstance;
module.exports.getInstance = getInstance;
