const
  gulp = require('gulp'),
  gzip = require('gulp-gzip'),
  featureCheck = require('../util/featureCheck');

module.exports = (name, config) => {

  gulp.task(name, () => {
    return gulp.src(config.source)
      .pipe(gzip())
      .pipe(featureCheck.ifDest(config, gulp.dest(config.dest)))
  });
};