import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';

// index.pug to html

const routes = {
  pug: {
    src: './src/*.pug',
    dest: './build',
  },
};

const pug = () => {
  return gulp.src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));
}

// clean the build folder

const clean = () => {
  return del([routes.pug.dest]);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);

// main function

export const dev = gulp.series([prepare, assets]);