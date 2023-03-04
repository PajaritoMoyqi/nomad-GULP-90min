import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';

// index.pug to html

const routes = {
  pug: {
    src: 'src/*.pug',
    dest: 'build/',
  },
};

const pug = () => {
  return gulp.src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));
}

const webserver = () => gulp.src(routes.pug.dest).pipe(ws({livereload: true, open: true}));

// clean the build folder

const clean = () => {
  return del([routes.pug.dest]);
}

// series

const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);
const postDev = gulp.series([webserver]);

// main function

export const dev = gulp.series([prepare, assets, postDev]);