const
  path = require('path'),
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
  source: 'source/copy/**/*',
  dest: 'public/',
  watch: process.argv[2] === 'dev'
});

require('./tasks/fonts')('fonts', {
  source: ['source/fonts/**/*.woff'],
  dest: 'public/css',
  targetFile: 'fonts.css',
  watch: process.argv[2] === 'dev'
});

require('./tasks/image')('images', {
    source: ['source/images/**/*.{png,jpg,jpeg,gif}', 'source/templates/**/*.{png,jpg,jpeg,gif}'],
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
    watch: process.argv[2] === 'dev'
  }
);

require('./tasks/image')('svg', {
  source: 'source/images/**/*.svg',
  dest: 'source/styleguide/icons',
  svgoPlugins: [
    {cleanupIDs: true},
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
    {removeAttrs: {attrs: 'id'}},
    {cleanupNumericValues: {floatPrecision: 2}}
  ],
  reCompress: true,
  flatten: true,
  hook: (file, t) => {
    let content = file.contents.toString();
    const basename = path.basename(file.path, path.extname(file.path));
    file.contents = Buffer.from(content.replace(/<svg/i, `<svg class="svg svg--${basename}"`), 'utf8');
  },
  watch: process.argv[2] === 'dev'
});

/*require('./tasks/sass')('sass', {
 base: 'source/css/',
 source: 'source/css/!**!/!*.{sass,scss}',
 dest: 'public/css',
 sourcemaps: argv.minify || false,
 minify: argv.minify || false,
 prefixOptions: {browsers: ['> 1%', 'last 1 versions'], cascade: false},
 watch: process.argv[2] === 'dev'
 });*/

require('./tasks/stylus')('stylus', {
  base: 'source/css/',
  source: ['source/css/**/reset.styl', 'source/css/**/*.styl', 'source/styleguide/**/*.styl', '!source/**/_*.styl'],
  watchSource: ['source/**/*.{styl,json}'],
  dest: 'public/css',
  targetFile: 'master.css',
  sourcemaps: argv.minify || false,
  minify: argv.minify || false,
  stylusOptions: {
    'include css': true,
    cache: false,
    use: [require('nib')()],
    import: [
      // __dirname + '/source/css/_styles',
      __dirname + '/source/css/_variables',
      __dirname + '/source/css/_mixins'
    ]
  },
  prefixOptions: {browsers: ['> 1%', 'last 1 versions'], cascade: false},
  watch: process.argv[2] === 'dev'
});

require('./tasks/script')('scripts', {
  source: 'source/js/**/*.js',
  entries: 'source/js/*.js',
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

  server: {
    open: false,
    https: {
      key: path.resolve('../atomatic/ssl/localhost.key'),
      cert: path.resolve('../atomatic/ssl/localhost.cert')
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

gulp.task('deploy', gulp.series('build', 'gzip', 's3deploy'));

gulp.task('build:styleguide', gulp.series('build', 'styleguide:build'));

