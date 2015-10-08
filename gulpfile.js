/*!
 * gulp
 * $ npm install 
        gulp-ruby-sass 
        gulp-autoprefixer 
        gulp-minify-css 
        gulp-jshint 
        gulp-concat 
        gulp-uglify 
        gulp-imagemin 
        gulp-notify 
        gulp-rename 
        gulp-livereload 
        gulp-cache 
        del 
            --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('serve', ['images', 'scripts', 'sass'], function() {

    browserSync.init({
        server: "./src",
        files: ['./src/**/*'],
        port: 4000,
        browser: "google chrome"


    });

    gulp.watch("./src/styles/*.scss", ['sass']);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch("./site/*.js").on('change', browserSync.reload);
    gulp.watch("./site/*.json").on('change', browserSync.reload);
    gulp.watch("./site/*.html").on('change', browserSync.reload);
});


// Styles
gulp.task('sass', function() {
  return sass('./src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(gulp.dest('./src/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('./src/scripts/**/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['./dist/assets/css', './dist/assets/js', './dist/assets/img'], cb)
});

// Default task
gulp.task('default', ['serve']);

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
};


