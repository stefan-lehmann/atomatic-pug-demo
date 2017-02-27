'use strict';

var
  gulp = require('gulp'),
  dotenv = require('dotenv'),
  argv = require('yargs').argv;

dotenv.config({silent: true});

require('./tasks/server')('server', {
  baseDir: 'public/'
});

require('./tasks/clean')('clean', {
  dir: 'public/*'
});

require('./tasks/copy')('copy', {
  source: 'demo/copy/**/*',
  dest: 'public/',
  watch: process.argv[2] === 'dev'
});

require('./tasks/fonts')('fonts', {
  source: ['demo/fonts/**/*.woff'],
  dest: 'public/css',
  targetFile: 'fonts.css',
  watch: process.argv[2] === 'dev'
});

require('./tasks/image')('images', {
    source: ['demo/images/**/*.{png,jpg,jpeg,gif}', 'demo/templates/**/*.{png,jpg,jpeg,gif}'],
    dest: 'public/images',
    svgoPlugins: [
      {collapseGroups: false},
      {convertPathData: false},
      {convertShapeToPath: true},
      {moveElemsAttrsToGroup: false},
      {moveGroupAttrsToElems: false},
      {removeHiddenElems: false},
      {removeUnknownsAndDefaults: false},
      {removeViewBox: false}
    ],
    reCompress: true,
    flatten: true,
    hook: function (file, t) {
      console.log(file.path.toString());
    },
    watch: process.argv[2] === 'dev'
  }
);

require('./tasks/image')('svg', {
  source: 'demo/images/**/*.svg',
  dest: 'demo/source/icons',
  svgoPlugins: [
    {removeDimensions: true},
    {removeStyleElement: true},
    {removeUselessStrokeAndFill: true},
    {collapseGroups: true},
    {convertPathData: false},
    {convertShapeToPath: true},
    {moveElemsAttrsToGroup: false},
    {moveGroupAttrsToElems: true},
    {removeHiddenElems: true},
    {removeUnknownsAndDefaults: true},
    {removeUselessStrokeAndFill: true},
    {removeEmptyContainers: true},
    {removeTitle: true},
    {removeViewBox: false},
    {removeEditorsNSData: true},
    {
      cleanupNumericValues: {
        floatPrecision: 2
      }
    }
  ],
  reCompress: true,
  flatten: true,
  watch: process.argv[2] === 'dev'
});

/*require('./tasks/sass')('sass', {
 base: 'demo/css/',
 source: 'demo/css/!**!/!*.{sass,scss}',
 dest: 'public/css',
 sourcemaps: argv.minify || false,
 minify: argv.minify || false,
 prefixOptions: {browsers: ['> 1%', 'last 1 versions'], cascade: false},
 watch: process.argv[2] === 'dev'
 });*/

require('./tasks/stylus')('stylus', {
  base: 'demo/css/',
  source: ['demo/css/**/reset.styl', 'demo/css/**/*.styl', 'demo/source/**/*.styl', '!demo/**/_*.styl'],
  watchSource: ['demo/**/*.{styl,json}'],
  dest: 'public/css',
  targetFile: 'master.css',
  sourcemaps: argv.minify || false,
  minify: argv.minify || false,
  stylusOptions: {
    'include css': true,
    cache: false,
    use: [require('nib')()],
    import: [
      // __dirname + '/demo/css/_styles',
      __dirname + '/demo/css/_variables',
      __dirname + '/demo/css/_mixins'
    ]
  },
  prefixOptions: {browsers: ['> 1%', 'last 1 versions'], cascade: false},
  watch: process.argv[2] === 'dev'
});

require('./tasks/script')('scripts', {
  source: 'demo/js/**/*.js',
  entries: 'demo/js/*.js',
  dest: 'public/js',
  jshint: {
    reporter: 'jshint-stylish',
    options: {
      esnext: true
    }
  },
  sourcemaps: argv.minify || false,
  minify: argv.minify || false,
  watch: process.argv[2] === 'dev'
});

require('./tasks/styleguide')('styleguide', {


  templateEngine: {
    name: 'pug',
    options: {
      url: 'https://localhost:9999'
    }
  },
  server: {
    open: false,
    https: {
      key: `${__dirname}/../atomatic/ssl/localhost.key`,
      cert: `${__dirname}/../atomatic/ssl/localhost.cert`
    }
  }
});

require('./tasks/gzip')('gzip', {
  source: ['public/**/*.js', 'public/**/*.css'],
  dest: 'public'
});

require('./tasks/s3deploy')('s3deploy', {
  source: 'public/**/*'
});

gulp.task('build', gulp.series('clean', gulp.parallel('scripts', 'stylus', 'fonts', 'svg')));
gulp.task('default', gulp.series('build'));
gulp.task('watch', gulp.parallel('stylus:watch', 'scripts:watch', 'fonts:watch', 'svg:watch'));
gulp.task('dev', gulp.series('build', 'styleguide:dev', 'watch'));

/*gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'scripts', 'images', 'stylus')));
 gulp.task('default', gulp.series('build'));
 gulp.task('watch', gulp.parallel('sass:watch', 'scripts:watch', 'images:watch', 'copy:watch'));
 gulp.task('dev', gulp.series('build', 'server', 'watch'));*/


gulp.task('deploy', gulp.series('build', 'gzip', 's3deploy'));

gulp.task('build:styleguide', gulp.series('build', 'styleguide:build'));

