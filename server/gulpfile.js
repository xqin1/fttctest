'use strict';
var docSource = ['app/**/*.js', 'config/**/*.js', 'config/*.js', 'util/**/*.js', 'util/*.js', 'server.js'],
    docTpl = {
        path: 'ink-docstrap',
        systemName      : 'Florida Turnpike Enterprise API Docs',
        footer          : '',
        copyright       : 'Copyright Florida Turnpike Enterprise 2014',
        navType         : 'vertical',
        theme           : 'journal',
        linenums        : true,
        collapseSymbols : false,
        inverseNav      : false
    },
    lintDir = ['server.js', 'app/controllers/*.js', 'config/*.js', 'config/routes/*.js', 'util/*.js', 'test/*.js'];

 //include gulp
var gulp = require('gulp'),
    jsdoc = require("gulp-jsdoc"),
    exec = require('gulp-exec'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');


gulp.task('jsdoc', function(){
    gulp.src(docSource)
        .pipe(jsdoc('./documents/codedoc', docTpl));
});

//Lint Task
gulp.task('lint', function () {
    return gulp.src(lintDir)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

//gulp-mocha not working in watch: https://github.com/sindresorhus/gulp-mocha/issues/1
//gulp requires a stream to work, that's why gulp.src('')
gulp.task('test', function () {
    return gulp.src('')
        //.pipe(mocha({reporter:'spec'}));
        .pipe(exec('node ./node_modules/.bin/mocha -R TAP test/test-*.js', {silent: false}));

});

gulp.task('crunch', function () {
    return gulp.src('')
        .pipe(exec('node ./scripts/createSchema.js', {silent: false}));

});

gulp.task('getAllExits', function () {
    return gulp.src('')
        .pipe(exec('node ./scripts/process_endpoints.js', {silent: false}));

});