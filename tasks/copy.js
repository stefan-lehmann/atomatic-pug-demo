const
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  browserSync = require('../util/browserSync'),
  featureCheck = require('../util/featureCheck');

module.exports = (name, config) => {

  gulp.task(name, () => {
    return gulp.src(config.source)
      .pipe(featureCheck.ifWatch(config, plumber()))
      .pipe(featureCheck.ifDest(config, gulp.dest(config.dest)))
      .pipe(featureCheck.ifWatch(config, browserSync.getInstance().stream()));
  });

  gulp.task(name+':watch', () => {
    gulp.watch(config.source, gulp.parallel(name));
  });
};