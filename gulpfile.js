var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

var exec = require('child_process').exec;

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "app.dev",
        notify: false
    });
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

/**
 * Run Duo.js. The task will be watched too.
 * Thanks to Fábio Vedovelli (https://gist.github.com/vedovelli/)
 */

// Arquivo a ser observado. -- Mude para a localização do seu arquivo --
var jsIn = './src/app.js';

// Arquivo a ser gerado. -- Mude para a localização do seu arquivo --
var jsOut = './build/app.js';

gulp.task('run-duo', function()
{
    exec('duo --stdout ' + jsIn + ' > ' + jsOut, function (err, stdout, stderr)
    {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    });
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch("src/sass/*.scss", ['sass']);
    gulp.watch(["**/*.html"]).on('change', browserSync.reload);
    gulp.watch(jsIn, ['run-duo']);
});

// Default Task
gulp.task('default', ['browser-sync', 'run-duo', 'sass', 'watch']);