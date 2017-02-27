const
  gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  stylus = require('gulp-stylus'),
  concat = require('gulp-concat'),
  cssnano = require('gulp-cssnano'),
  prefix = require('gulp-autoprefixer'),
  path = require('path'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('../util/browserSync'),
  featureCheck = require('../util/featureCheck');

module.exports = (name, config) => {

  gulp.task(name, () => {

    return gulp.src(config.source, {base: config.base})
      .pipe(featureCheck.ifWatch(config, plumber()))
      .pipe(featureCheck.ifSourceMap(config, sourcemaps.init()))
      .pipe(stylus(config.stylusOptions || {}))
      .pipe(featureCheck.ifConcat(config, concat(config.targetFile)))
      .pipe(prefix(config.prefixOptions || { browsers: ['> 1%', 'last 1 versions'], cascade: false }))
      .pipe(featureCheck.ifHook(config, config.hook))
      .pipe(featureCheck.ifMinify(config, cssnano()))
      .pipe(featureCheck.ifSourceMap(config, sourcemaps.write('./')))
      .pipe(featureCheck.ifDest(config, gulp.dest(config.dest)));
      // .pipe(featureCheck.ifWatch(config, browserSync.getInstance().stream()));
  });

  gulp.task(name + ':watch', () => {
    browserSync.getInstance()
    .watch(`${config.dest}/**/*.css`)
    .on("change", browserSync.getInstance().reload);
    gulp.watch(config.watchSource || config.source[0], gulp.parallel(name));
  });
};