'use strict';




/*------------------------------------*\
  plugins
\*------------------------------------*/

var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var notify        = require('gulp-notify');
var plumber       = require('gulp-plumber');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps    = require('gulp-sourcemaps');





/*------------------------------------*\
  table of contents
\*------------------------------------*/
/*

  configuration _____ config variables for tasks

  cssbuild __________ sass, autoprefixer, etc

  server ____________ runs browsersync server
  reload ____________ browsersync reload
  watch _____________ watches files and then builds and reloads
  default ___________ runs [server, watch]

*/





/*------------------------------------*\
  configuration
\*------------------------------------*/

var serverconfig = {
  server: {
    baseDir: './',
    directory: true
  },
  open: false,
  ui: false,
  ghostMode: false,
  notify: false
};

var css = {
  base: 'style/css',
  src: ['style/css/global.scss'],
  dest: 'style/css'
}

var sassconfig = {
  outputStyle: 'expanded',
};

var autoprefixerconfig = {
  cascade: false,
  browsers: [
    '> 0.1%',
    'last 6 versions',
    'last 6 Android versions',
    'last 6 BlackBerry versions',
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ]
};





/*------------------------------------*\
  cssbuild
\*------------------------------------*/
gulp.task('cssbuild', function() {

  //src
  return gulp.src(css.src, {base: css.base})

  //plumber
  .pipe(plumber({errorHandler: function(error) {
    notify.onError({
      title:    'build failed',
      message:  'cssbuild: <%= error.message %>'
    })(error);
    this.emit('end');
  }}))

  .pipe(sourcemaps.init())
    .pipe(sass(sassconfig))
    .pipe(autoprefixer(autoprefixerconfig))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(css.dest))
  .pipe(browserSync.reload({stream: true}));

});


/*------------------------------------*\
  server
\*------------------------------------*/
gulp.task('server', function() {
  browserSync(serverconfig);
});


/*------------------------------------*\
  reload
\*------------------------------------*/
gulp.task('reload', browserSync.reload);


/*------------------------------------*\
  watch
\*------------------------------------*/
gulp.task('watch', function() {

  //build
  gulp.watch(['style/css/**/*', "!style/css/**/*.css.map", "!style/css/**/*.css"], ['cssbuild']);

});


/*------------------------------------*\
  default
\*------------------------------------*/
gulp.task('default', ['server', 'watch']);

