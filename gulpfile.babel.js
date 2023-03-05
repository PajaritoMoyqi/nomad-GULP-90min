import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';

// index.pug to index.html

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: 'src/*.pug',
    dest: 'build/',
  },
};

const pug = () => {
  return gulp.src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));
}

// webserver on

const webserver = () => gulp.src(routes.pug.dest).pipe(ws({livereload: true, open: true}));

// watch files

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
}

// clean the build folder

const clean = () => {
  return del([routes.pug.dest]);
}

// series

const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);
const postDev = gulp.parallel([webserver, watch]); // two task, so parallel

// main function

export const dev = gulp.series([prepare, assets, postDev]);