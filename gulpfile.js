"use strict";

var gulp       = require('gulp');
var connect    = require('gulp-connect'); // Runs a local dev server
var open       = require('gulp-open'); // Open a URL in a webbrowser
var browserify = require('browserify'); // Bundles JS
var reactify   = require('reactify'); // Transforms React JSX to JS
var source     = require('vinyl-source-stream'); // Use conventional text stream with Gulp
var concat     = require('gulp-concat') // concatenates files
var lint       = require('gulp-eslint'); // Lint JS files, including JSX

var config = {
  port: 8000,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/**/*.js',
    css: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
    ],
    dist: './dist',
    mainJs: './src/main.js'
  }
}

//Start a local development server

gulp.task('connect', function() {
    connect.server({
          root: ['dist'],
          port: config.port,
          base: config.devBaseUrl,
          livereload: true
    })
});

gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }))
});

// go get any html file and send it to our destination file and then reload using connect
gulp.task('html', function(){
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
})

gulp.task('js', function(){
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload())
})

gulp.task('css', function(){
  gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dist + '/css'))
    .pipe(connect.reload())
})

// checks our javascript / enforce coding standard
gulp.task('lint', function() {
  return gulp.src(config.paths.js)
    .pipe(lint({config: 'eslint.config.json'}))
    .pipe(lint.format())
})

//watching html, if anything change we change the html path
gulp.task('watch', function() {
   gulp.watch(config.paths.html, ['html']);
   gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js','lint', 'open', 'watch', 'css']);
