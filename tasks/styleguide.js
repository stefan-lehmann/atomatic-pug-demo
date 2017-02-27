const
  gulp = require('gulp'),
  DesignSystemCreator = require('../../atomatic');

module.exports = (name, config) => {

  gulp.task(name + ':dev', (cb) => {
    const watch = true;
    const dsc = new DesignSystemCreator(config, watch, cb);
  });

  gulp.task(name + ':build', (cb) => {
    const watch = false;
    return new DesignSystemCreator(config, watch, cb);
  });
};