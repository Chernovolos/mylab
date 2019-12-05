import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import gulpWatch from 'gulp-watch';
import rigger from 'gulp-rigger';

const server = browserSync.create();

const serverConfig = {
    server: {
        baseDir: './src'
    },
    tunnel: false,
    host: 'localhost',
    port: 3001,
    logPrefix: ' [server] '
};

const SRC = {
    DEV: {
        STYLE: './src/styles/',
        SCRIPT: './src/js/'
    },
    SERVE: {
        STYLE: './src/',
        SCRIPT: './src/'
    },
    BUILD: {
        STYLE: './dist/',
        SCRIPT: './dist/'
    }
};

// html build
// gulp.task('html', done => {
//
// });

// js serve
gulp.task('js-serve', async done => {
    gulp.src(SRC.DEV.SCRIPT + 'index.js')
        .pipe(rigger())
        .pipe(sourcemaps.init())
        // minify
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(SRC.SERVE.SCRIPT));
    done();
});

// scss serve
gulp.task('sass-serve', async done => {
    gulp.src(SRC.DEV.STYLE + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
        }).on('error', sass.logError))
        // add prefixes
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(SRC.SERVE.STYLE))
        .pipe(browserSync.stream());
    done();
});

// scss build
gulp.task('sass-build', async done => {
    gulp.src(SRC.DEV.STYLE + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
        }).on('error', sass.logError))
        // minify, add prefixes
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(SRC.BUILD.STYLE));
    done();
});

// watch
gulp.task('watch', done => {
    gulp.watch(['./src/index.html'])
        .on('change', server.reload),
        gulp.watch([SRC.DEV.STYLE + '**/*']).on('change', gulp.series('sass-serve', server.reload)),
        gulp.watch([SRC.DEV.SCRIPT + '**/*']).on('change', gulp.series('js-serve', server.reload)),
        done();
});

// start browser
gulp.task('start-browser', done => {
    server.init(serverConfig);
    done();
});

// serve
gulp.task('serve', gulp.series('sass-serve', 'js-serve', 'start-browser', 'watch'));
