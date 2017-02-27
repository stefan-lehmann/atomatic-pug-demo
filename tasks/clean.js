const
  gulp = require('gulp'),
  del = require('del');

module.exports = (name, config) => {

  gulp.task(name, () => {
    return del(config.dir);
  });
};