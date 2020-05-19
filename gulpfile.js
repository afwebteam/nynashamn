/* global exports */

(() => {

    'use strict';

    //----- GULP -----
    const
        {
            series,
            parallel,
            src,
            dest,
            watch
        } = require('gulp'),

        autoprefixer = require('gulp-autoprefixer'),
        connect = require('gulp-connect'),
        replace = require('gulp-replace'),
        clean = require('gulp-clean'),
        concat = require('gulp-concat'),
        sass = require('gulp-sass'),
        fs = require('fs'),

        css = () => {
            return src('./src/scss/*.scss')
                .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
                .pipe(replace('@charset "UTF-8";\n', ''))
                .pipe(autoprefixer({
                    overrideBrowserslist: [
                        'defaults', // > 0.5%, last 2 versions, Firefox ESR, not dead
                        'IE 11'
                    ],
                    cascade: false
                }))
                .pipe(concat('layout.css'))
                .pipe(dest('./dist'));
        },

        js = () => {
            return src('./src/js/**/*')
                .pipe(dest('./dist/js'));
        },

        cleanDist = () => {
            return src('./dist', { read: false })
                .pipe(clean());
        },

        dist = () => {
            return src([
                './src/**/*.php',
                './src/**/*.md',
                './src/**/*.svg',
                './src/**/*.png'
            ])
                .pipe(dest('./dist'))
                .pipe(connect.reload());
        },

        reload = (done) => {
            connect.reload();
            done();
        },

        connectServer = (done) => {
            connect.server({
                root: 'dist',
                https: {
                    key: fs.readFileSync('_cert/localhost.key'),
                    cert: fs.readFileSync('_cert/localhost.crt')
                },
                livereload: {
                    enable: true,
                    port: 8088
                },
                host: 'localhost',
                port: 8080
            });
            done();
        },

        addWatcher = (done) => {
            watch(['./src/**/*'], series(parallel(css, js), dist));
            done();
        };

    sass.compiler = require('node-sass');

    exports.deploy = series(cleanDist, parallel(css, js), dist);

    exports.watch = series(
        cleanDist,
        parallel(css, js),
        dist,
        addWatcher,
        connectServer
    );

})();

