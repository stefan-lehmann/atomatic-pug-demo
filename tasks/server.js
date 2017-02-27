const
  gulp = require('gulp'),
  browserSync = require('../util/browserSync');

module.exports = (name, config) => {

  gulp.task(name + ':reload', (cb) => {
    browserSync.getInstance().reload(getReloadWildCards(config));
    return cb();
  });

  gulp.task(name, (cb) => {
    browserSync.getInstance().init(config, cb);
  });

};